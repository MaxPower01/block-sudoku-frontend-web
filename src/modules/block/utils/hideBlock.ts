export default function hideBlock(params: {
  element: HTMLElement | undefined;
}): void {
  const { element } = params;
  if (element) {
    element.style.transition = "";
    element.style.opacity = "0";
    element.style.pointerEvents = "none";
    element.classList.remove("xyz-in");
    element.setAttribute("data-is-hidden", "true");
  }
}
