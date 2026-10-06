const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/builds`;
const BUILD_COMPONENTS_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/build_components`;

// sends the token and tells the server the body is JSON
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const index = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const show = async (buildId) => {
  const res = await fetch(`${BASE_URL}/${buildId}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const create = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const update = async (buildId, formData) => {
  const res = await fetch(`${BASE_URL}/${buildId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const deleteBuild = async (buildId) => {
  const res = await fetch(`${BASE_URL}/${buildId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  // a successful delete sends back no body
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail);
  }
};

const createBuildComponent = async (buildId, formData) => {
  const res = await fetch(`${BASE_URL}/${buildId}/build_components`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const updateBuildComponent = async (buildComponentId, formData) => {
  const res = await fetch(`${BUILD_COMPONENTS_URL}/${buildComponentId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail);

  return data;
};

const deleteBuildComponent = async (buildComponentId) => {
  const res = await fetch(`${BUILD_COMPONENTS_URL}/${buildComponentId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail);
  }
};

export {
  index,
  show,
  create,
  update,
  deleteBuild,
  createBuildComponent,
  updateBuildComponent,
  deleteBuildComponent,
};