export const modal = () => {
    if (!document.querySelector("[data-modal-target]")) {
        return;
    }

    const openModal = (modal) => {
        document.documentElement.classList.add("locked");
        modal.classList.add("opened");
    };

    const closeModal = (modal) => {
        document.documentElement.classList.remove("locked");
        modal.classList.remove("opened");
    };

    const handleClick = (e) => {
        const target = e.target;

        if (target.closest("[data-modal-target]")) {
            const isDrawer = !!target.dataset.drawer;
            const modalContent = document.querySelector(`[data-modal-id="${target.dataset.modalTarget}"]`);

            if (!modalContent) {
                return;
            }

            let modalDest;
            let modal;

            if (isDrawer) {
                modalDest = document.getElementById("drawerModalDestination");
            } else {
                modalDest = document.getElementById("modalModalDestination");
            }

            if (modalDest) {
                modal = modalDest.closest("[data-modal]");
                openModal(modal);
                modalDest.innerHTML = modalContent.outerHTML;
            }
        }

        if (target.closest("[data-modal] a[href]")) {
            closeModal(target.closest("[data-modal]"));
        }

        if (target.closest("[data-modal-close]") || target.closest("[data-modal-backdrop]") ) {
            const modal = target.closest("[data-modal]");

            if (modal) {
                closeModal(modal);
            }
        }
    };

    document.addEventListener("click", handleClick);
};
