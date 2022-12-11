export default function showBlocks(params: {
  blocks: NodeListOf<HTMLElement>;
}): void {
  const { blocks } = params;
  blocks.forEach((block) => {
    setTimeout(() => {
      block.style.opacity = "1";
      block.style.pointerEvents = "auto";
      block.setAttribute("xyz", "fade small");
      block.classList.add("xyz-in");
      block.setAttribute("data-is-hidden", "false");
    }, 100);
  });
}
