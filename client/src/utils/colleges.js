/**
 * CampusArena — College Domain to College Name Mapping
 * Used for simple frontend-side college detection from email addresses.
 */

/** @type {Record<string, string>} */
export const COLLEGE_DOMAIN_MAP = {
  // IITs
  'iitd.ac.in': 'IIT Delhi',
  'iitb.ac.in': 'IIT Bombay',
  'iitm.ac.in': 'IIT Madras',
  'iitk.ac.in': 'IIT Kanpur',
  'iitkgp.ac.in': 'IIT Kharagpur',
  'iitr.ac.in': 'IIT Roorkee',
  'iitg.ac.in': 'IIT Guwahati',
  'iith.ac.in': 'IIT Hyderabad',
  'iitbhu.ac.in': 'IIT BHU',
  'iitj.ac.in': 'IIT Jodhpur',
  'iitpkd.ac.in': 'IIT Palakkad',
  'iitdh.ac.in': 'IIT Dharwad',

  // NITs
  'nitt.edu': 'NIT Trichy',
  'nitk.edu.in': 'NIT Karnataka',
  'nitw.ac.in': 'NIT Warangal',
  'nitc.ac.in': 'NIT Calicut',
  'nitp.ac.in': 'NIT Patna',
  'mnit.ac.in': 'MNIT Jaipur',
  'vnit.ac.in': 'VNIT Nagpur',

  // IIITs
  'iiitd.ac.in': 'IIIT Delhi',
  'iiitb.ac.in': 'IIIT Bangalore',
  'iiit.ac.in': 'IIIT Hyderabad',
  'iiita.ac.in': 'IIIT Allahabad',
  'iiitl.ac.in': 'IIIT Lucknow',

  // BITS
  'bits-pilani.ac.in': 'BITS Pilani',
  'hyderabad.bits-pilani.ac.in': 'BITS Hyderabad',
  'goa.bits-pilani.ac.in': 'BITS Goa',
  'dubai.bits-pilani.ac.in': 'BITS Dubai',

  // VIT
  'vit.ac.in': 'VIT Vellore',
  'vitap.ac.in': 'VIT AP',
  'vitbhopal.ac.in': 'VIT Bhopal',
  'vit.edu': 'VIT Vellore',

  // SRM
  'srmist.edu.in': 'SRM Institute',
  'srm.edu.in': 'SRM University',

  // Delhi
  'dtu.ac.in': 'Delhi Technological University',
  'nsut.ac.in': 'Netaji Subhas University of Technology',
  'igdtuw.ac.in': 'IGDTUW Delhi',
  'du.ac.in': 'Delhi University',
  'jmi.ac.in': 'Jamia Millia Islamia',
  'jnu.ac.in': 'JNU Delhi',
  'ipu.ac.in': 'Indraprastha University',

  // Central Universities / Others
  'amity.edu': 'Amity University',
  'manipal.edu': 'Manipal University',
  'thapar.edu': 'Thapar Institute',
  'christuniversity.in': 'Christ University',
  'lpu.in': 'Lovely Professional University',
  'chitkara.edu.in': 'Chitkara University',
  'bennett.edu.in': 'Bennett University',
  'snu.edu.in': 'Shiv Nadar University',
  'ashoka.edu.in': 'Ashoka University',
  'krea.edu.in': 'Krea University',
  'pec.ac.in': 'Punjab Engineering College',
  'pu.ac.in': 'Punjab University',
  'iiserpune.ac.in': 'IISER Pune',
  'iiserkol.ac.in': 'IISER Kolkata',
  'iiserb.ac.in': 'IISER Bhopal',
  'sjce.ac.in': 'SJCE Mysore',
  'sjtu.edu.cn': 'SJTU',

  // Common generic .edu fallback domains
  'mit.edu': 'MIT',
  'stanford.edu': 'Stanford University',
};

/**
 * Detects college name from an institutional email address.
 * Checks direct domain match first, then subdomain fallback.
 *
 * @param {string} email - The user's institutional email address
 * @returns {{ college: string, domain: string, verified: boolean, needsConfirmation: boolean } | null}
 */
export const getCollegeFromEmail = (email) => {
  if (!email || !email.includes('@')) return null;

  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return null;

  // 1. Direct domain match
  if (COLLEGE_DOMAIN_MAP[domain]) {
    return {
      college: COLLEGE_DOMAIN_MAP[domain],
      domain,
      verified: true,
      needsConfirmation: false,
    };
  }

  // 2. Subdomain match — e.g. cs.iitd.ac.in → iitd.ac.in
  const parts = domain.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const parentDomain = parts.slice(i).join('.');
    if (COLLEGE_DOMAIN_MAP[parentDomain]) {
      return {
        college: COLLEGE_DOMAIN_MAP[parentDomain],
        domain: parentDomain,
        verified: true,
        needsConfirmation: false,
      };
    }
  }

  // 3. Unknown domain — generate a best-guess name from TLD
  const rootPart = parts[0];
  const guessedName = rootPart.charAt(0).toUpperCase() + rootPart.slice(1);
  return {
    college: guessedName,
    domain,
    verified: false,
    needsConfirmation: true,
  };
};

/**
 * Validates whether an email address looks like an institutional email.
 * Accepts .edu, .ac.in, .edu.in, .ac.uk, .edu.au domains.
 *
 * @param {string} email
 * @returns {boolean}
 */
export const isValidCollegeEmail = (email) => {
  if (!email) return false;
  const COLLEGE_EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.in|ac\.uk|edu\.au|ac\.nz)$/i;
  return COLLEGE_EMAIL_REGEX.test(email);
};
