/**
 * Auto-Save Contact Utility
 * 
 * Alternative implementations for automatically saving contacts
 * when a business card is loaded.
 */

interface ContactData {
  fullName?: string;
  displayName?: string;
  prefixes?: string;
  companyName?: string;
  designation?: string;
  primaryContactNumber?: string;
  secondaryContactNumber?: string;
  whatsappNumber?: string;
  businessContact?: string;
  emailAddress?: string;
  businessEmailAddress?: string;
  companyLocation?: string;
  personalWebsite?: string;
  companyWebsiteUrl?: string;
  linkedinProfile?: string;
}

/**
 * Generates a vCard string from contact data
 */
export const generateVCardString = (contact: ContactData): string => {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.prefixes ? `${contact.prefixes} ` : ''}${contact.fullName || contact.displayName || 'Unknown User'}`,
    contact.companyName ? `ORG:${contact.companyName}` : '',
    contact.designation ? `TITLE:${contact.designation}` : '',
    contact.primaryContactNumber ? `TEL;TYPE=WORK,VOICE:${contact.primaryContactNumber}` : '',
    contact.secondaryContactNumber ? `TEL;TYPE=HOME,VOICE:${contact.secondaryContactNumber}` : '',
    contact.whatsappNumber ? `TEL;TYPE=CELL:${contact.whatsappNumber}` : '',
    contact.businessContact ? `TEL;TYPE=WORK:${contact.businessContact}` : '',
    contact.emailAddress ? `EMAIL;TYPE=WORK:${contact.emailAddress}` : '',
    contact.businessEmailAddress ? `EMAIL;TYPE=WORK:${contact.businessEmailAddress}` : '',
    contact.companyLocation ? `ADR;TYPE=WORK:;;${contact.companyLocation};;;;` : '',
    contact.personalWebsite ? `URL:${contact.personalWebsite}` : '',
    contact.companyWebsiteUrl ? `URL:${contact.companyWebsiteUrl}` : '',
    contact.linkedinProfile ? `URL:${contact.linkedinProfile}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\n');

  return vCard;
};

/**
 * Downloads a vCard file
 */
export const downloadVCard = (contact: ContactData): void => {
  const vCard = generateVCardString(contact);
  const blob = new Blob([vCard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(contact.fullName || 'contact').replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Automatically download vCard without prompting (use with caution)
 * 
 * @param contact - Contact data to save
 * @param cardId - Unique identifier for the card
 * @param delayMs - Delay before auto-download (default: 2000ms)
 * @param storageKey - Key prefix for localStorage (default: 'auto-saved')
 * @returns boolean - Whether auto-save was triggered
 */
export const autoSaveContact = (
  contact: ContactData,
  cardId: string,
  delayMs: number = 2000,
  storageKey: string = 'auto-saved'
): boolean => {
  const hasAutoSaved = sessionStorage.getItem(`${storageKey}-${cardId}`);
  
  if (!hasAutoSaved) {
    setTimeout(() => {
      downloadVCard(contact);
      sessionStorage.setItem(`${storageKey}-${cardId}`, 'true');
    }, delayMs);
    return true;
  }
  
  return false;
};

/**
 * Check if contact has been auto-saved before (in this session)
 */
export const hasBeenAutoSaved = (cardId: string, storageKey: string = 'auto-saved'): boolean => {
  return sessionStorage.getItem(`${storageKey}-${cardId}`) !== null;
};

/**
 * Check if user has been prompted before (persistent across sessions)
 */
export const hasBeenPrompted = (cardId: string, storageKey: string = 'save-prompt'): boolean => {
  return localStorage.getItem(`${storageKey}-${cardId}`) !== null;
};

/**
 * Mark that user has been prompted
 */
export const markAsPrompted = (cardId: string, storageKey: string = 'save-prompt'): void => {
  localStorage.setItem(`${storageKey}-${cardId}`, 'true');
};

/**
 * Reset auto-save status (useful for testing)
 */
export const resetAutoSaveStatus = (cardId: string): void => {
  sessionStorage.removeItem(`auto-saved-${cardId}`);
  localStorage.removeItem(`save-prompt-${cardId}`);
};

/**
 * iOS-specific vCard download with better handling
 * On iOS, we can use a data URI to trigger the contact save dialog
 */
export const downloadVCardIOS = (contact: ContactData): void => {
  const vCard = generateVCardString(contact);
  const filename = `${(contact.fullName || 'contact').replace(/\s+/g, '_')}.vcf`;
  
  // For iOS, use data URI
  const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;
  
  const a = document.createElement('a');
  a.href = dataUri;
  a.download = filename;
  
  // iOS Safari requires the link to be in the DOM
  a.style.display = 'none';
  document.body.appendChild(a);
  
  a.click();
  
  // Clean up after a delay
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
};

/**
 * Detect if device is iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Smart download that chooses the best method for the device
 */
export const smartDownloadVCard = (contact: ContactData): void => {
  if (isIOS()) {
    downloadVCardIOS(contact);
  } else {
    downloadVCard(contact);
  }
};

/**
 * Share vCard using Web Share API (if supported)
 */
export const shareVCard = async (contact: ContactData): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }

  try {
    const vCard = generateVCardString(contact);
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const file = new File(
      [blob],
      `${(contact.fullName || 'contact').replace(/\s+/g, '_')}.vcf`,
      { type: 'text/vcard' }
    );

    await navigator.share({
      title: contact.fullName || 'Contact',
      text: `Save ${contact.fullName || 'this contact'} to your contacts`,
      files: [file],
    });

    return true;
  } catch (error) {
    console.error('Error sharing vCard:', error);
    return false;
  }
};

/**
 * Generate a data URL for QR code that contains vCard data
 * This can be used to generate a QR code that directly adds contact when scanned
 */
export const generateVCardDataURL = (contact: ContactData): string => {
  const vCard = generateVCardString(contact);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;
};

