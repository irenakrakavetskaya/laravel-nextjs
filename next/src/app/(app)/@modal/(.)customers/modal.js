'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

//check https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals

export function Modal({ children }) {
    const router = useRouter();
    const dialogRef = useRef();

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <div className="modal-backdrop">
            <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
                {children}
                <button onClick={onDismiss} className="close-button" />
            </dialog>
        </div>,
        document.getElementById('modal-root'),
    )
}