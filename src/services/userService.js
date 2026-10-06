const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const index = async () => {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail);
  }
};

export { index, deleteUser };