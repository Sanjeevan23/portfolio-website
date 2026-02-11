'use client';
import { AnimatePresence, motion, PanInfo, useAnimation } from 'framer-motion';
import { contact } from '../data/contact';
import { FaWhatsapp, FaEnvelope, FaGithub, FaLinkedin, FaTimes } from 'react-icons/fa';
import { useRef } from 'react';
import Button from './Button';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ContactModal({ open, onClose }: Props) {
    const sheetControls = useAnimation();
    const modalRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100) {
            onClose(); // close modal if dragged down enough
        } else {
            sheetControls.start({ y: 0 }); // snap back if not enough
        }
    };

    const wa = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`;
    const mail = `mailto:${contact.email.address}?subject=${encodeURIComponent(contact.email.subject)}&body=${encodeURIComponent(contact.email.body)}`;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Glass Sheet */}
                    <motion.div
                        ref={modalRef}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                        className="w-full sm:w-[420px] bg-white/10 backdrop-blur-lg rounded-t-3xl p-6 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] pb-20"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Let’s Chat!</h3>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
                                <FaTimes size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-white/70 mt-1 text-center">Choose your channel</p>

                        {/* WhatsApp + Email side by side */}
                        <div className="mt-6 flex gap-4 justify-center">
                            {/* WhatsApp */}
                            <motion.a
                                href={wa}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 flex flex-col justify-center gap-2 px-4 py-4 rounded-xl bg-green-600/90 text-white shadow-lg relative overflow-hidden"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* Inner animation */}
                                <motion.div
                                    className="absolute inset-0 bg-green-400/20 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.3 }}

                                />
                                <div className="flex items-left gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FaWhatsapp size={22} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">WhatsApp</div>
                                        <div className="text-xs opacity-80">Chat</div>
                                    </div>
                                </div>
                            </motion.a>

                            {/* Email */}
                            <motion.a
                                href={mail}
                                className="flex-1 flex flex-col justify-center gap-2 px-4 py-4 rounded-xl bg-white/10 text-white shadow-lg relative overflow-hidden"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/20 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 0.15 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Email</div>
                                        <div className="text-xs opacity-80">Send</div>
                                    </div>
                                </div>
                            </motion.a>
                        </div>

                        {/* Social */}
                        <div className="mt-15 flex justify-center gap-6">
                            <Button
                                href={contact.social.github}
                                target="_blank"
                                rel="noreferrer"
                                variant="ghost"
                                size="sm"
                                className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
                            >
                                <FaGithub size={20} />
                            </Button>

                            {/* <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<FaGithub />}
                                href="https://github.com"
                                target="_blank"
                            >
                                GitHub
                            </Button> */}
                            <Button
                                href={contact.social.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                variant="ghost"
                                size="sm"
                                className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
                            >
                                <FaLinkedin size={20} />
                            </Button>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
