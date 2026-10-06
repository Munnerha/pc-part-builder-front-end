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