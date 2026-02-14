import axios from 'axios';

const API = axios.create({
  baseURL: 'http://Your Laptop IP',
  timeout: 20000,
});

export const registerFace = async (
  employeeId: string,
  images: string[]
) => {
  const formData = new FormData();
  formData.append('employeeId', employeeId);

  images.forEach((path, index) => {
    formData.append('images', {
      uri: 'file://' + path,
      type: 'image/jpeg',
      name: `face_${index}.jpg`,
    } as any);
  });

  const res = await API.post(`/face/register`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return res.data;
};


export const verifyFace = async (
  imagePath: string,
  employeeId: string
) => {
  const formData = new FormData();

  // ALWAYS send this
  formData.append('employeeId', employeeId);

  formData.append('image', {
    uri: `file://${imagePath}`,
    name: 'attendance.jpg',
    type: 'image/jpeg',
  } as any);

  console.log('📤 Sending image to backend:', imagePath);
  console.log('🆔 employeeId:', employeeId);

  const response = await API.post(
    '/face/verify',
    formData,
    {
      headers: {
        // IMPORTANT: let axios set boundary automatically
        'Content-Type': 'multipart/form-data',
      },
      timeout: 15000,
    }
  );

  return response.data;
};



