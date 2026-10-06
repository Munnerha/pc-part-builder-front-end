export function formatPrice(amount) {
  return `$${amount.toLocaleString()}`;
}

export function getTotal(build) {
  return build.build_components.reduce(
    (total, buildComponent) => total + buildComponent.component.price * buildComponent.quantity,
    0
  );
}