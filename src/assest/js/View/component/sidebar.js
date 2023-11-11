class sidebar {
  sidebarfunction(eventTarget, element, backdrop) {
    eventTarget.addEventListener('click', () => {
      element.style.left = 0;
      element.style.zIndex = 10000;
      backdrop.style.display = 'block';
    });
  }
  closeSidebarFunction(eventTarget, element) {
    eventTarget.addEventListener('click', () => {
      element.style.left = '-300px';
      eventTarget.style.display = 'none';
    });
  }
}
export default new sidebar();
