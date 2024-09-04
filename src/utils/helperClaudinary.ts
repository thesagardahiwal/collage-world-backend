export const getResourceTypeFromUrl = (url : string) : string => {
    if (url.includes('.jpg') || url.includes('.jpeg')) {
      return 'image';
    } else if (url.includes('.mp3')) {
      return 'video';
    } else {
      return 'unknown';
    }
  }

  export const getLocationOfFile = (contentId : string) : string => {
    return "uploads/"+contentId;
  }