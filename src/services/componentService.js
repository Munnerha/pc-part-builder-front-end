const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/components`;

const index = async (category) => {
  // with a category, only that type of part comes back
  const url = category ? `${BASE_URL}?category=${category}` : BASE_URL;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

export { index };