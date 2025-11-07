document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.grok-app');
    const navItems = document.querySelectorAll('.nav-item');
    const historyItems = document.querySelectorAll('.history-item');
    const historyEntries = document.querySelectorAll('.history-entry');
    const workspaceItems = document.querySelectorAll('.workspace-item');
    const views = document.querySelectorAll('.view');
    const queryInput = document.querySelector('.query-input input');
    const queryWrapper = document.querySelector('.query-input');
    const queryMode = document.querySelector('.query-mode');
    const queryTool = document.querySelector('.query-tool');
    const modeMenu = document.querySelector('.mode-menu');
    const attachMenu = document.querySelector('.attach-menu');
    const quickActions = document.querySelectorAll('.action-chip');
    const modals = document.querySelectorAll('.modal');
    const navArray = Array.from(navItems);

    const modalTriggers = new Map();

    const menuAnchors = new Map();

    const switchView = target => {
        if (!target) return;
        closeMenus();
        views.forEach(view => {
            const isMatch = view.dataset.view === target;
            view.classList.toggle('is-active', isMatch);
            view.setAttribute('aria-hidden', String(!isMatch));
            if (isMatch) {
                view.removeAttribute('hidden');
            } else {
                view.setAttribute('hidden', '');
            }
        });
        navItems.forEach(item => {
            const isActive = item.dataset.target === target;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', String(isActive));
            item.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };

    const setActiveState = (collection, current) => {
        collection.forEach(item => {
            const isActive = item === current;
            item.classList.toggle('is-active', isActive);
            if (item.tagName === 'BUTTON') {
                item.setAttribute('aria-pressed', String(isActive));
            }
        });
    };

    const positionFloatingMenu = (menu, trigger) => {
        if (!menu || !trigger || !app) return;
        const appRect = app.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const previousVisibility = menu.style.visibility;
        menu.style.visibility = 'hidden';
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        let left = triggerRect.left - appRect.left;
        const maxLeft = appRect.width - menuWidth - 24;
        left = Math.max(24, Math.min(left, maxLeft));
        const maxTop = appRect.height - menuHeight - 24;
        const desiredTop = triggerRect.bottom - appRect.top + 12;
        const top = Math.max(24, Math.min(desiredTop, maxTop));

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.style.visibility = previousVisibility;
    };

    const closeMenus = () => {
        [modeMenu, attachMenu].forEach(menu => {
            if (!menu) return;
            menu.classList.remove('is-open');
            menu.style.visibility = '';
            menu.setAttribute('aria-hidden', 'true');
            menu.setAttribute('hidden', '');
            menuAnchors.delete(menu);
        });
        if (queryMode) queryMode.setAttribute('aria-expanded', 'false');
        if (queryTool) queryTool.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = (menu, trigger) => {
        if (!menu || !trigger) return;
        const isOpen = menu.classList.contains('is-open');
        closeMenus();
        if (!isOpen) {
            menuAnchors.set(menu, trigger);
            menu.removeAttribute('hidden');
            menu.classList.add('is-open');
            menu.setAttribute('aria-hidden', 'false');
            menu.style.visibility = 'hidden';
            positionFloatingMenu(menu, trigger);
            menu.style.visibility = '';
            trigger.setAttribute('aria-expanded', 'true');
        }
    };

    const handleOutsideClick = event => {
        const isClickInsideMenu = [modeMenu, attachMenu].some(menu => menu && menu.contains(event.target));
        const isTrigger = event.target.closest('.query-mode, .query-tool');
        const actionChip = event.target.closest('.action-chip');
        if (actionChip && ['deepsearch', 'news'].includes(actionChip.dataset.action)) {
            return;
        }
        if (!isClickInsideMenu && !isTrigger) {
            closeMenus();
        }
    };

    const closeModal = modal => {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('hidden', '');
        const trigger = modalTriggers.get(modal);
        if (trigger) {
            modalTriggers.delete(modal);
            if (typeof trigger.focus === 'function') {
                trigger.focus();
            }
        }
    };

    const openModal = (id, trigger) => {
        const modal = document.querySelector(`#modal-${id}`);
        if (!modal) return;
        closeMenus();
        modals.forEach(item => {
            if (item !== modal) {
                item.classList.remove('is-open');
                item.setAttribute('aria-hidden', 'true');
                item.setAttribute('hidden', '');
                modalTriggers.delete(item);
            }
        });
        modal.removeAttribute('hidden');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        if (trigger) {
            modalTriggers.set(modal, trigger);
        } else {
            modalTriggers.delete(modal);
        }
        const focusTarget = modal.querySelector('[data-close-modal], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusTarget) {
            focusTarget.focus();
        }
    };

    const bindModalTabs = modal => {
        const tabs = modal.querySelectorAll('.modal-tab');
        const panels = modal.querySelectorAll('[data-tab-panel]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach(btn => {
                    const isActive = btn === tab;
                    btn.classList.toggle('is-active', isActive);
                    btn.setAttribute('aria-selected', String(isActive));
                });
                panels.forEach(panel => {
                    panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
                });
            });
        });
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            switchView(target);
        });
    });

    navArray.forEach((item, index) => {
        item.addEventListener('keydown', event => {
            let targetIndex = null;
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                targetIndex = (index - 1 + navArray.length) % navArray.length;
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                targetIndex = (index + 1) % navArray.length;
            } else if (event.key === 'Home') {
                targetIndex = 0;
            } else if (event.key === 'End') {
                targetIndex = navArray.length - 1;
            }

            if (targetIndex !== null) {
                event.preventDefault();
                const nextItem = navArray[targetIndex];
                nextItem.focus();
                switchView(nextItem.dataset.target);
            }
        });
    });

    quickActions.forEach(action => {
        action.addEventListener('click', () => {
            const target = action.dataset.action;
            if (target === 'voice' || target === 'image') {
                switchView(target);
            } else if (target === 'deepsearch') {
                toggleMenu(modeMenu, queryMode);
            } else if (target === 'news') {
                toggleMenu(attachMenu, queryTool);
            }
        });
    });

    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            setActiveState(historyItems, item);
        });
    });

    historyEntries.forEach(entry => {
        entry.addEventListener('click', () => {
            setActiveState(historyEntries, entry);
        });
    });

    workspaceItems.forEach(item => {
        item.addEventListener('click', () => {
            setActiveState(workspaceItems, item);
        });
    });

    if (queryInput && queryWrapper) {
        queryInput.addEventListener('focus', () => queryWrapper.classList.add('is-focused'));
        queryInput.addEventListener('blur', () => queryWrapper.classList.remove('is-focused'));
    }

    if (queryMode) {
        queryMode.addEventListener('click', () => {
            toggleMenu(modeMenu, queryMode);
        });
    }

    if (queryTool) {
        queryTool.addEventListener('click', () => {
            toggleMenu(attachMenu, queryTool);
        });
    }

    if (modeMenu) {
        const modeButtons = modeMenu.querySelectorAll('[data-mode]');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('is-active'));
                button.classList.add('is-active');
                const label = button.querySelector('.menu-title');
                if (queryMode && label) {
                    queryMode.querySelector('span').textContent = label.textContent.replace(/\s+Beta/i, '').trim();
                }
                closeMenus();
            });
        });
    }

    document.addEventListener('click', handleOutsideClick);

    window.addEventListener('resize', () => {
        menuAnchors.forEach((trigger, menu) => {
            positionFloatingMenu(menu, trigger);
        });
    });

    modals.forEach(modal => {
        bindModalTabs(modal);
        modal.addEventListener('click', event => {
            if (event.target.closest('[data-close-modal]')) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            modals.forEach(closeModal);
            closeMenus();
        }
    });

    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            const id = trigger.dataset.openModal;
            openModal(id, trigger);
        });
    });

    switchView('chat');
});
