import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { DailyNoteServiceType } from '@/types/database';

export interface NotePickerContext {
    date: string;
    serviceType: DailyNoteServiceType;
}

interface ModalState {
    showerPickerGuest: any | null;
    laundryPickerGuest: any | null;
    bicyclePickerGuest: any | null;
    notePickerContext: NotePickerContext | null;

    setShowerPickerGuest: (guest: any | null) => void;
    setLaundryPickerGuest: (guest: any | null) => void;
    setBicyclePickerGuest: (guest: any | null) => void;
    setNotePickerContext: (context: NotePickerContext | null) => void;
    openNoteModal: (date: string, serviceType: DailyNoteServiceType) => void;

    closeAllModals: () => void;
}

export const useModalStore = create<ModalState>()(
    devtools(
        immer((set) => ({
            showerPickerGuest: null,
            laundryPickerGuest: null,
            bicyclePickerGuest: null,
            notePickerContext: null,

            setShowerPickerGuest: (guest) => {
                set((state) => {
                    state.showerPickerGuest = guest;
                });
            },
            setLaundryPickerGuest: (guest) => {
                set((state) => {
                    state.laundryPickerGuest = guest;
                });
            },
            setBicyclePickerGuest: (guest) => {
                set((state) => {
                    state.bicyclePickerGuest = guest;
                });
            },
            setNotePickerContext: (context) => {
                set((state) => {
                    state.notePickerContext = context;
                });
            },
            openNoteModal: (date, serviceType) => {
                set((state) => {
                    state.notePickerContext = { date, serviceType };
                });
            },
            closeAllModals: () => {
                set((state) => {
                    state.showerPickerGuest = null;
                    state.laundryPickerGuest = null;
                    state.bicyclePickerGuest = null;
                    state.notePickerContext = null;
                });
            }
        })),
        { name: 'ModalStore' }
    )
);
