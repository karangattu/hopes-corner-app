'use client';

import { AnimatePresence } from 'framer-motion';
import { useModalStore } from '@/stores/useModalStore';
import { ShowerBookingModal } from '@/components/modals/ShowerBookingModal';
import { LaundryBookingModal } from '@/components/modals/LaundryBookingModal';
import { BicycleRepairBookingModal } from '@/components/modals/BicycleRepairBookingModal';
import { DailyNoteModal } from '@/components/modals/DailyNoteModal';

export function ModalContainer() {
    const { showerPickerGuest, laundryPickerGuest, bicyclePickerGuest, notePickerContext } = useModalStore();

    return (
        <AnimatePresence>
            {showerPickerGuest && <ShowerBookingModal />}
            {laundryPickerGuest && <LaundryBookingModal />}
            {bicyclePickerGuest && <BicycleRepairBookingModal />}
            {notePickerContext && <DailyNoteModal />}
        </AnimatePresence>
    );
}
