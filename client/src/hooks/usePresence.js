// usePresence.js — tracks which players are currently online
// using Supabase Realtime Presence channels.
// No extra DB tables needed — purely ephemeral channel state.

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from './useAuth';

const PRESENCE_TOPIC = 'campus-online';

const usePresence = () => {
  const { user } = useAuth();
  const [online, setOnline] = useState([]); // array of { id, name, status }
  const userName = user?.name || 'Player';

  useEffect(() => {
    // Don't subscribe until we have a logged-in user
    if (!user?._id) return;

    let channel;
    let isActive = true;

    const setupPresence = async () => {
      // Vite + React StrictMode can remount effects before Supabase finishes
      // removing the previous channel, so clear any stale copy first.
      await Promise.all(
        supabase
          .getChannels()
          .filter((existing) => existing.topic === `realtime:${PRESENCE_TOPIC}`)
          .map((existing) => supabase.removeChannel(existing))
      );

      if (!isActive) return;

      // Create the channel — but DO NOT call .subscribe() yet
      channel = supabase.channel(PRESENCE_TOPIC, {
        config: { presence: { key: user._id } },
      });

      // Register ALL .on() handlers BEFORE calling .subscribe()
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();

        // presenceState() -> { [key]: [{ user_id, name, status, ... }] }
        const users = Object.values(state)
          .flat()
          .map((p) => ({
            id:     p.user_id,
            name:   p.name   || 'Player',
            status: p.status || 'online',
          }))
          .filter((p) => p.id !== user._id); // exclude yourself

        if (isActive) setOnline(users);
      });

      // Now it's safe to subscribe and track our own presence
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && isActive) {
          await channel.track({
            user_id: user._id,
            name:    userName,
            status:  'online',
          });
        }
      });
    };

    setupPresence();

    return () => {
      isActive = false;
      // Untrack ourselves and clean up the channel on unmount / user change
      if (channel) {
        channel.untrack().finally(() => supabase.removeChannel(channel));
      }
    };
  }, [user?._id, userName]); // re-run if the logged-in user's presence identity changes

  return { online };
};

export default usePresence;
