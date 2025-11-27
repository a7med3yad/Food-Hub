// src/hooks/usePortalRoot.js
import { useEffect, useState } from 'react';

/**
 * Ensures a shared DOM node exists that we can mount modals into and
 * exposes it to the component via state so we can safely use it with portals.
 */
const usePortalRoot = (id = 'modal-root') => {
  const [root, setRoot] = useState(null);

  useEffect(() => {
    let target = document.getElementById(id);

    if (!target) {
      target = document.createElement('div');
      target.setAttribute('id', id);
      document.body.appendChild(target);
    }

    setRoot(target);
  }, [id]);

  return root;
};

export default usePortalRoot;

