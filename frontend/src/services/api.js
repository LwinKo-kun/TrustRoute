import axiosInstance from '../api/axios';

export const getListingImageUrl = (listingId) => {
  const host = window.location.hostname;
  return `http://${host}:8000/api/listings/${listingId}/image`;
};

export default axiosInstance;