import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/packages/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            boxShadow: {},
            backgroundImage: {},
            zIndex: {
                5: '5',
                10: '10',
                15: '15',
                20: '20',
                25: '25',
                30: '30',
                45: '45',
                50: '50'
            },
            fontFamily: {
                robotoFlex: ['var(--font-roboto-flex)']
            },
            colors: {
                secondary: 'rgba(33, 33, 33, <alpha-value>)', // Black accent
                secondary100: 'rgba(66, 66, 66, <alpha-value>)',
                secondary200: 'rgba(97, 97, 97, <alpha-value>)',
                secondary300: 'rgba(117, 117, 117, <alpha-value>)',
                secondary400: 'rgba(158, 158, 158, <alpha-value>)',

                primary: 'rgba(255, 203, 0, <alpha-value>)', // Base yellow color
                'primary-hover': 'rgba(255, 203, 0, 0.8)', // Darker shade for hover effect
                'primary-active': 'rgba(255, 203, 0, 0.6)', // Even darker shade for active state
                primary100: 'rgba(255, 238, 122, <alpha-value>)', // Very light shade
                primary200: 'rgba(255, 223, 77, <alpha-value>)', // Light shade
                primary300: 'rgba(255, 209, 32, <alpha-value>)', // Light-medium shade
                primary400: 'rgba(255, 196, 0, <alpha-value>)', // Medium shade
                primary500: 'rgba(255, 203, 0, <alpha-value>)', // Base color
                primary600: 'rgba(225, 175, 0, <alpha-value>)', // Darker shade
                primary700: 'rgba(195, 147, 0, <alpha-value>)', // More pronounced dark shade
                primary800: 'rgba(165, 119, 0, <alpha-value>)', // Even darker shade
                primary900: 'rgba(135, 91, 0, <alpha-value>)', // Very dark shade

                black: 'rgba(33, 33, 33, <alpha-value>)', // Darker black for text and high contrast
                white: 'rgba(255, 255, 255, <alpha-value>)',
                grey100: 'rgba(245, 245, 245, <alpha-value>)',
                grey200: 'rgba(238, 238, 238, <alpha-value>)',
                grey300: 'rgba(224, 224, 224, <alpha-value>)',
                grey400: 'rgba(189, 189, 189, <alpha-value>)',
                grey500: 'rgba(158, 158, 158, <alpha-value>)',
                grey600: 'rgba(117, 117, 117, <alpha-value>)',
                grey700: 'rgba(97, 97, 97, <alpha-value>)',
                grey800: 'rgba(66, 66, 66, <alpha-value>)',
                grey900: 'rgba(33, 33, 33, <alpha-value>)',
                grey: 'rgba(84, 95, 113, <alpha-value>)',

                green100: 'rgba(232, 248, 240, <alpha-value>)',
                green200: 'rgba(209, 240, 226, <alpha-value>)',
                green300: 'rgba(187, 233, 211, <alpha-value>)',
                green400: 'rgba(164, 226, 196, <alpha-value>)',
                green500: 'rgba(141, 219, 182, <alpha-value>)',
                green600: 'rgba(118, 211, 167, <alpha-value>)',
                green700: 'rgba(95, 204, 152, <alpha-value>)',
                green800: 'rgba(73, 197, 137, <alpha-value>)',
                green900: 'rgba(50, 189, 123, <alpha-value>)',
                green: 'rgba(46, 178, 156, <alpha-value>)',

                orange100: 'rgba(255, 242, 230, <alpha-value>)',
                orange200: 'rgba(255, 228, 205, <alpha-value>)',
                orange300: 'rgba(255, 214, 180, <alpha-value>)',
                orange400: 'rgba(255, 201, 156, <alpha-value>)',
                orange500: 'rgba(255, 188, 131, <alpha-value>)',
                orange600: 'rgba(254, 161, 81, <alpha-value>)',
                orange700: 'rgba(254, 148, 57, <alpha-value>)',
                orange800: 'rgba(254, 134, 32, <alpha-value>)',
                orange900: 'rgba(254, 121, 7, <alpha-value>)',
                orange: 'rgba(252, 163, 17, <alpha-value>)',

                red100: 'rgba(254, 232, 236, <alpha-value>)',
                red200: 'rgba(253, 210, 216, <alpha-value>)',
                red300: 'rgba(252, 188, 197, <alpha-value>)',
                red400: 'rgba(250, 165, 177, <alpha-value>)',
                red500: 'rgba(249, 142, 158, <alpha-value>)',
                red600: 'rgba(247, 120, 139, <alpha-value>)',
                red700: 'rgba(247, 97, 119, <alpha-value>)',
                red800: 'rgba(245, 75, 100, <alpha-value>)',
                red900: 'rgba(244, 53, 80, <alpha-value>)',
                red: 'rgba(249, 57, 67, <alpha-value>)',

                yellow100: 'rgba(255, 252, 239, <alpha-value>)',
                yellow200: 'rgba(255, 249, 222, <alpha-value>)',
                yellow300: 'rgba(255, 246, 206, <alpha-value>)',
                yellow400: 'rgba(255, 242, 190, <alpha-value>)',
                yellow500: 'rgba(255, 239, 174, <alpha-value>)',
                yellow600: 'rgba(254, 236, 157, <alpha-value>)',
                yellow700: 'rgba(254, 233, 141, <alpha-value>)',
                yellow800: 'rgba(254, 229, 125, <alpha-value>)',
                yellow900: 'rgba(254, 226, 108, <alpha-value>)',
                yellow: 'rgba(254, 223, 92, <alpha-value>)', // Primary yellow color

                purple100: 'rgba(243, 237, 251, <alpha-value>)',
                purple200: 'rgba(230, 219, 246, <alpha-value>)',
                purple300: 'rgba(218, 201, 242, <alpha-value>)',
                purple400: 'rgba(206, 183, 238, <alpha-value>)',
                purple500: 'rgba(194, 165, 233, <alpha-value>)',
                purple600: 'rgba(182, 147, 228, <alpha-value>)',
                purple700: 'rgba(169, 129, 223, <alpha-value>)',
                purple800: 'rgba(157, 111, 217, <alpha-value>)',
                purple900: 'rgba(144, 93, 212, )',
                purple: 'rgba(130, 80, 204, )'
            }
        }
    },
    plugins: []
}

export default config
