import { useRef, useCallback } from 'react'
import { IModalController } from '../../base-components/modal-context'

/**
 * Hook para controlar um único modal programaticamente
 * @returns Objeto com ref e funções de controle
 */
export function useModal() {
    const modalRef = useRef<IModalController>(null)

    const openModal = useCallback(() => {
        modalRef.current?.open()
    }, [])

    const closeModal = useCallback(() => {
        modalRef.current?.close()
    }, [])

    const toggleModal = useCallback(() => {
        modalRef.current?.toggle()
    }, [])

    const isModalOpen = useCallback(() => {
        return modalRef.current?.isOpen() || false
    }, [])

    return {
        modalRef,
        openModal,
        closeModal,
        toggleModal,
        isModalOpen
    }
}

/**
 * Hook para controlar múltiplos modais programaticamente
 * @param modalIds Array de IDs dos modais
 * @returns Objeto com refs e funções de controle para cada modal
 */
export function useMultipleModals(modalIds: string[]) {
    const modalRefs = useRef<Record<string, IModalController>>({})

    const openModal = useCallback((modalId: string) => {
        modalRefs.current[modalId]?.open()
    }, [])

    const closeModal = useCallback((modalId: string) => {
        modalRefs.current[modalId]?.close()
    }, [])

    const toggleModal = useCallback((modalId: string) => {
        modalRefs.current[modalId]?.toggle()
    }, [])

    const isModalOpen = useCallback((modalId: string) => {
        return modalRefs.current[modalId]?.isOpen() || false
    }, [])

    const closeAllModals = useCallback(() => {
        modalIds.forEach(id => {
            modalRefs.current[id]?.close()
        })
    }, [modalIds])

    const openAllModals = useCallback(() => {
        modalIds.forEach(id => {
            modalRefs.current[id]?.open()
        })
    }, [modalIds])

    const getModalRef = useCallback((modalId: string) => {
        return modalRefs.current[modalId]
    }, [])

    const setModalRef = useCallback((modalId: string, ref: IModalController | null) => {
        if (ref) {
            modalRefs.current[modalId] = ref
        } else {
            delete modalRefs.current[modalId]
        }
    }, [])

    return {
        modalRefs,
        openModal,
        closeModal,
        toggleModal,
        isModalOpen,
        closeAllModals,
        openAllModals,
        getModalRef,
        setModalRef
    }
}
