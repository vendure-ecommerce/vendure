import { useChannel } from '@/index.js';
import { useLocalFormat } from '@/index.js';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

type AnimationConfig = {
    mass?: number;
    stiffness?: number;
    damping?: number;
};

export function AnimatedNumber({
    value,
    animationConfig = { mass: 0.8, stiffness: 75, damping: 15 },
}: {
    value: number;
    animationConfig?: AnimationConfig;
}) {
    let spring = useSpring(value, animationConfig);
    let display = useTransform(spring, current => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

export function AnimatedCurrency({
    value,
    animationConfig = { mass: 0.8, stiffness: 75, damping: 15 },
}: {
    value: number;
    animationConfig?: AnimationConfig;
}) {
    const { activeChannel } = useChannel();
    const { formatCurrency } = useLocalFormat();

    let spring = useSpring(value, animationConfig);
    let display = useTransform(spring, current =>
        formatCurrency(current, activeChannel?.defaultCurrencyCode ?? 'USD'),
    );

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}
