// the slots every build has, in the order they are shown
export const CATEGORIES = ['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'Cooler', 'PSU', 'Case'];

export function formatPrice(amount) {
  return `$${amount.toLocaleString()}`;
}

// the part a build has in one slot, if any
export function getBuildComponent(build, category) {
  return build.build_components.find(
    (buildComponent) => buildComponent.component.category === category
  );
}

export function getTotal(build) {
  return build.build_components.reduce(
    (total, buildComponent) => total + buildComponent.component.price * buildComponent.quantity,
    0
  );
}

// the specs that matter for compatibility, as one line of text
export function getSpecs(component) {
  const specs = [component.socket, component.memory_type, component.form_factor];

  if (component.gpu_length) specs.push(`${component.gpu_length}mm long`);
  if (component.max_gpu_length) specs.push(`GPU up to ${component.max_gpu_length}mm`);
  if (component.cooler_height) specs.push(`${component.cooler_height}mm tall`);
  if (component.max_cooler_height) specs.push(`cooler up to ${component.max_cooler_height}mm`);

  return specs.filter((spec) => spec).join(' · ');
}

export function getWarnings(build) {
  const warnings = [];
  const cpu = getBuildComponent(build, 'CPU')?.component;
  const motherboard = getBuildComponent(build, 'Motherboard')?.component;
  const ram = getBuildComponent(build, 'RAM')?.component;
  const gpu = getBuildComponent(build, 'GPU')?.component;
  const cooler = getBuildComponent(build, 'Cooler')?.component;
  const pcCase = getBuildComponent(build, 'Case')?.component;

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    warnings.push(`${cpu.name} (${cpu.socket}) doesn't fit ${motherboard.name} (${motherboard.socket})`);
  }

  if (ram && motherboard && ram.memory_type !== motherboard.memory_type) {
    warnings.push(`${motherboard.name} needs ${motherboard.memory_type} memory, but ${ram.name} is ${ram.memory_type}`);
  }

  if (gpu && pcCase && gpu.gpu_length > pcCase.max_gpu_length) {
    warnings.push(`${gpu.name} (${gpu.gpu_length}mm) is too long for ${pcCase.name} (max ${pcCase.max_gpu_length}mm)`);
  }

  if (cooler && pcCase && cooler.cooler_height > pcCase.max_cooler_height) {
    warnings.push(`${cooler.name} (${cooler.cooler_height}mm) is too tall for ${pcCase.name} (max ${pcCase.max_cooler_height}mm)`);
  }

  return warnings;
}

// AM4 parts use DDR4 memory and AM5 parts use DDR5
const SOCKET_MEMORY = { AM4: 'DDR4', AM5: 'DDR5' };

// true when a part fits the parts already in the build
export function fitsBuild(component, build) {
  const cpu = getBuildComponent(build, 'CPU')?.component;
  const motherboard = getBuildComponent(build, 'Motherboard')?.component;
  const ram = getBuildComponent(build, 'RAM')?.component;
  const gpu = getBuildComponent(build, 'GPU')?.component;
  const cooler = getBuildComponent(build, 'Cooler')?.component;
  const pcCase = getBuildComponent(build, 'Case')?.component;

  if (component.category === 'CPU') {
    if (motherboard && component.socket !== motherboard.socket) return false;
    if (ram && SOCKET_MEMORY[component.socket] !== ram.memory_type) return false;
  }

  if (component.category === 'Motherboard') {
    if (cpu && component.socket !== cpu.socket) return false;
    if (ram && component.memory_type !== ram.memory_type) return false;
  }

  if (component.category === 'RAM') {
    if (motherboard && component.memory_type !== motherboard.memory_type) return false;
    if (cpu && component.memory_type !== SOCKET_MEMORY[cpu.socket]) return false;
  }

  if (component.category === 'GPU') {
    if (pcCase && component.gpu_length > pcCase.max_gpu_length) return false;
  }

  if (component.category === 'Cooler') {
    if (pcCase && component.cooler_height > pcCase.max_cooler_height) return false;
  }

  if (component.category === 'Case') {
    if (gpu && gpu.gpu_length > component.max_gpu_length) return false;
    if (cooler && cooler.cooler_height > component.max_cooler_height) return false;
  }

  return true;
}