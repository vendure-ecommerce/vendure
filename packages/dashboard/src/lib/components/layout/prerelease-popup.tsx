import { useUserSettings } from '@/hooks/use-user-settings.js';
import { useState } from 'react';
import { toast } from 'sonner';

export function PrereleasePopup() {
    const { settings, setHasSeenOnboarding } = useUserSettings();
    const [isOpen, setIsOpen] = useState(false);
    if (!settings.hasSeenOnboarding && !isOpen) {
        setIsOpen(true);
        toast('Welcome to the new Dashboard!', {
            description: (
                <div className="space-y-2">
                    <p>
                        This is an <span className="font-bold">alpha</span> version of our new Vendure
                        Dashboard!
                    </p>
                    <p>
                        This release allows you to explore the new interface and functionality, but it's not
                        yet ready for production use.
                    </p>
                    <p>
                        If you find missing or broken functionality, you don't need to report it on GitHub at
                        this point - we're already working on it!
                    </p>
                </div>
            ),
            duration: 1000 * 60,
            action: {
                label: 'Got it',
                onClick: () => {
                    setHasSeenOnboarding(true);
                    setIsOpen(false);
                },
            },
        });
    }
    return null;
}
