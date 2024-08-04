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
                // secondary: 'rgba(116, 110, 160, <alpha-value>)',
                // secondary100: 'rgba(249, 251, 252, <alpha-value>)',
                // secondary200: 'rgba(234, 233, 241, <alpha-value>)',
                // secondary300: 'rgba(227, 226, 236, <alpha-value>)',
                // secondary400: 'rgba(185, 182, 207, <alpha-value>)'
            },
            transitionDuration: {
                DEFAULT: '200ms'
            },
            gridTemplateColumns: {
                16: 'repeat(16, minmax(0, 1fr))'
            },
            fontSize: {
                '3xl': '2rem',
                sm: ['14px', '24px']
            },
            containers: {
                xs: '375px',
                sm: '576px',
                md: '768px',
                lg: '1024px',
                xl: '1440px',
                '2xl': '1680px'
            }
        },

        screens: {
            xs: '375px',
            sm: '576px',
            md: '768px',
            lg: '1024px',
            xl: '1440px',
            '2xl': '1680px'
        }
        // colors: {
        //     current: 'currentColor',
        //     primary: 'rgba(var(--color-primary), <alpha-value>)',
        //     transparent: 'transparent',
        //     'primary-hover': 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>), black 21%)',
        //     'primary-active': 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>), black 42%)',
        //     primary100: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 5%, white 95%)',
        //     primary200: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 10%, white 90%)',
        //     primary300: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 15%, white 85%)',
        //     primary400: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 25%, white 75%)',
        //     primary500: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 50%, white 50%)',
        //     primary600: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 65%, black 30%)',
        //     primary700: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 95%, black 10%)',
        //     primary800: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 95%, black 10%)',
        //     primary900: 'color-mix(in srgb, rgba(var(--color-primary), <alpha-value>) 95%, black 10%)',

        //     black: 'rgba(18, 0, 53, <alpha-value>)',
        //     white: 'rgba(255, 255, 255, <alpha-value>)',
        //     grey100: 'rgba(250, 250, 255, <alpha-value>)',
        //     grey200: 'rgba(239, 240, 247, <alpha-value>)',
        //     grey300: 'rgba(240, 241, 243, <alpha-value>)',
        //     grey400: 'rgba(233, 234, 237, <alpha-value>)',
        //     grey500: 'rgba(230, 233, 240, <alpha-value>)',
        //     grey600: 'rgba(219, 221, 224, <alpha-value>)',
        //     grey700: 'rgba(206, 211, 224, <alpha-value>)',
        //     grey800: 'rgba(181, 187, 198, <alpha-value>)',
        //     grey900: 'rgba(182, 186, 194, <alpha-value>)',
        //     grey1000: 'rgba(145, 152, 163, <alpha-value>)',
        //     grey: 'rgba(84, 95, 113, <alpha-value>)',

        //     green100: 'rgba(232, 248, 240, <alpha-value>)',
        //     green200: 'rgba(209, 240, 226, <alpha-value>)',
        //     green300: 'rgba(187, 233, 211, <alpha-value>)',
        //     green400: 'rgba(164, 226, 196, <alpha-value>)',
        //     green500: 'rgba(141, 219, 182, <alpha-value>)',
        //     green600: 'rgba(118, 211, 167, <alpha-value>)',
        //     green700: 'rgba(95, 204, 152, <alpha-value>)',
        //     green800: 'rgba(73, 197, 137, <alpha-value>)',
        //     green900: 'rgba(50, 189, 123, <alpha-value>)',
        //     green: 'rgba(46, 178, 156, <alpha-value>)',

        //     orange100: 'rgba(255, 242, 230, <alpha-value>)',
        //     orange200: 'rgba(255, 228, 205, <alpha-value>)',
        //     orange300: 'rgba(255, 228, 205, <alpha-value>)',
        //     orange400: 'rgba(255, 201, 156, <alpha-value>)',
        //     orange500: 'rgba(255, 188, 131, <alpha-value>)',
        //     orange600: 'rgba(254, 161, 81, <alpha-value>)',
        //     orange700: 'rgba(254, 148, 57, <alpha-value>)',
        //     orange800: 'rgba(254, 134, 32, <alpha-value>)',
        //     orange900: 'rgba(254, 121, 7, <alpha-value>)',
        //     orange: 'rgba(252, 163, 17, <alpha-value>)',

        //     red100: 'rgba(254, 232, 236, <alpha-value>)',
        //     red200: 'rgba(253, 210, 216, <alpha-value>)',
        //     red300: 'rgba(252, 188, 197, <alpha-value>)',
        //     red400: 'rgba(250, 165, 177, <alpha-value>)',
        //     red500: 'rgba(249, 142, 158, <alpha-value>)',
        //     red600: 'rgba(247, 120, 139, <alpha-value>)',
        //     red700: 'rgba(247, 97, 119, <alpha-value>)',
        //     red800: 'rgba(245, 75, 100, <alpha-value>)',
        //     red900: 'rgba(244, 53, 80, <alpha-value>)',
        //     red: 'rgba(249, 57, 67, <alpha-value>)',

        //     yellow100: 'rgba(255, 252, 239, <alpha-value>)',
        //     yellow200: 'rgba(255, 249, 222, <alpha-value>)',
        //     yellow300: 'rgba(255, 246, 206, <alpha-value>)',
        //     yellow400: 'rgba(255, 242, 190, <alpha-value>)',
        //     yellow500: 'rgba(255, 239, 174, <alpha-value>)',
        //     yellow600: 'rgba(254, 236, 157, <alpha-value>)',
        //     yellow700: 'rgba(254, 233, 141, <alpha-value>)',
        //     yellow800: 'rgba(254, 229, 125, <alpha-value>)',
        //     yellow900: 'rgba(254, 226, 108, <alpha-value>)',
        //     yellow: 'rgba(254, 223, 92, <alpha-value>)',

        //     purple100: 'rgba(243, 237, 251, <alpha-value>)',
        //     purple200: 'rgba(230, 219, 246, <alpha-value>)',
        //     purple300: 'rgba(218, 201, 242, <alpha-value>)',
        //     purple400: 'rgba(206, 183, 238, <alpha-value>)',
        //     purple500: 'rgba(193, 165, 234, <alpha-value>)',
        //     purple600: 'rgba(181, 148, 229, <alpha-value>)',
        //     purple700: 'rgba(168, 130, 225, <alpha-value>)',
        //     purple800: 'rgba(157, 112, 221, <alpha-value>)',
        //     purple900: 'rgba(144, 94, 216, <alpha-value>)',
        //     purple: 'rgba(132, 76, 212, <alpha-value>)',

        //     pink100: 'rgba(249, 232, 254, <alpha-value>)',
        //     pink200: 'rgba(244, 209, 252, <alpha-value>)',
        //     pink300: 'rgba(238, 187, 251, <alpha-value>)',
        //     pink400: 'rgba(232, 164, 249, <alpha-value>)',
        //     pink500: 'rgba(226, 141, 248, <alpha-value>)',
        //     pink600: 'rgba(221, 118, 246, <alpha-value>)',
        //     pink700: 'rgba(215, 95, 244, <alpha-value>)',
        //     pink800: 'rgba(209, 73, 243, <alpha-value>)',
        //     pink900: 'rgba(204, 50, 242, <alpha-value>)',
        //     pink: 'rgba(198, 27, 240, <alpha-value>)'
        // },
        // keyframes: {
        //     load: {
        //         from: { height: '15px' },
        //         to: { height: '75px' }
        //     },
        //     slideDownAndFadeIn: {
        //         from: { opacity: '0', transform: 'translateY(-4px)' },
        //         to: { opacity: '1', transform: 'translateY(0)' }
        //     },
        //     slideLeftAndFadeIn: {
        //         from: { opacity: '0', transform: 'translateX(4px)' },
        //         to: { opacity: '1', transform: 'translateX(0)' }
        //     },
        //     slideUpAndFadeIn: {
        //         from: { opacity: '0', transform: 'translateY(4px)' },
        //         to: { opacity: '1', transform: 'translateY(0)' }
        //     },
        //     slideRightAndFadeIn: {
        //         from: { opacity: '0', transform: 'translateX(-4px)' },
        //         to: { opacity: '1', transform: 'translateX(0)' }
        //     },
        //     fadeIn: {
        //         from: { opacity: '0' },
        //         to: { opacity: '1' }
        //     },
        //     fadeOut: {
        //         from: { opacity: '1' },
        //         to: { opacity: '0' }
        //     },
        //     scaleIn: {
        //         from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
        //         to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' }
        //     },
        //     scaleOut: {
        //         from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        //         to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' }
        //     },
        //     slideInRight: {
        //         from: { opacity: '0', transform: 'translateX(100%)' },
        //         to: { opacity: '1', transform: 'translateX(0)' }
        //     },
        //     slideOutRight: {
        //         from: { opacity: '1', transform: 'translateX(0)' },
        //         to: { opacity: '0', transform: 'translateX(100%)' }
        //     },
        //     loader: {
        //         '0%': { left: '0' },
        //         '50%': { left: 'calc(100% - 200px)' },
        //         '100%': { left: '0' }
        //     },
        //     pulse: {
        //         '0%, 100%': { opacity: '1' },
        //         '50%': { opacity: '0.5' }
        //     },
        //     reverseRotate: {
        //         from: {
        //             transform: 'rotate(0deg)'
        //         },
        //         to: {
        //             transform: 'rotate(-360deg)'
        //         }
        //     }
        // },
        // animation: {
        //     slideDownAndFadeIn: 'slideDownAndFadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     slideLeftAndFadeIn: 'slideLeftAndFadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     slideUpAndFadeIn: 'slideUpAndFadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     slideRightAndFadeIn: 'slideRightAndFadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     fadeIn: 'fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     fadeOut: 'fadeOut 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     scaleIn: 'scaleIn 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     scaleOut: 'scaleOut 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     slideInRight: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     slideOutRight: 'slideOutRight 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        //     loader: 'loader 3s infinite',
        //     load: 'load 0.5s alternate infinite cubic-bezier(0.19, 0.97, 1, 1)',
        //     pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        //     reverseRotate: 'reverseRotate 900s linear infinite'
        // },
        // blur: {
        //     xs: '2px'
        // }
    },
    plugins: []
}

export default config
