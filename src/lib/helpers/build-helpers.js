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