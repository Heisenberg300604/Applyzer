/**
 * Centralized Clerk appearance configuration.
 * Passed to <ClerkProvider appearance={clerkAppearance}> in main.tsx so that
 * it applies globally to every Clerk component — SignIn, SignUp, UserButton,
 * UserProfile, etc. — without needing per-component appearance props.
 *
 * Design system:
 *   Primary accent : #f97316 (orange-500)
 *   Primary hover  : #ea580c (orange-600)
 *   Surface        : #ffffff
 *   Body text      : #111827 (gray-900)
 *   Muted text     : #6b7280 (gray-500)
 *   Border         : #e5e7eb (gray-200)
 *   Font           : Plus Jakarta Sans
 *   Radius         : 0.75 rem
 */

export const clerkAppearance = {
    /* ── Layout ─────────────────────────────────────────────────────────── */
    layout: {
        // Don't render a Clerk logo inside the card — we supply our own branding
        // in the page's left panel and mobile header.
        logoPlacement: 'none',
        // Full-width social login buttons read better than tiny icons
        socialButtonsPlacement: 'top',
        socialButtonsVariant: 'blockButton',
    },

    /* ── Design tokens ───────────────────────────────────────────────────
     * Clerk converts these to CSS custom properties it uses internally.
     * Setting them here overrides the defaults without needing !important.
     * ──────────────────────────────────────────────────────────────────── */
    variables: {
        // Brand orange as the single primary color
        colorPrimary: '#f97316',
        colorTextOnPrimaryBackground: '#ffffff',

        // Surfaces & text
        colorBackground: '#ffffff',
        colorInputBackground: '#ffffff',
        colorInputText: '#111827',
        colorText: '#111827',
        colorTextSecondary: '#6b7280',
        colorNeutral: '#374151',

        // Semantic
        colorDanger: '#ef4444',
        colorSuccess: '#22c55e',
        colorWarning: '#f59e0b',

        // Typography — match the site's Plus Jakarta Sans
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: { normal: 400, medium: 600, bold: 700 },
        fontSize: '15px',

        // Shape — match --radius: 0.75rem from index.css
        borderRadius: '0.75rem',
        spacingUnit: '1rem',
    },

    /* ── Per-element CSS ─────────────────────────────────────────────────
     * Each value here is a CSS properties object (applied as injected styles).
     * Pseudo-selectors (:hover, :focus) are handled via index.css using the
     * stable ".cl-*" class names that Clerk exposes.
     * ──────────────────────────────────────────────────────────────────── */
    elements: {
        /* Card ─────────────────────────────────────────────────────────── */
        // rootBox wraps everything — keep it full-width so it fills the panel
        rootBox: {
            width: '100%',
        },
        card: {
            // Clean white card that floats subtly on the #fafafa page background
            boxShadow:
                '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
            border: '1px solid #f3f4f6',
            borderRadius: '1.25rem',
            padding: '2rem',
            // Let the parent panel control width, not Clerk's internal default
            width: '100%',
            maxWidth: '420px',
        },

        /* Header ────────────────────────────────────────────────────────── */
        headerTitle: {
            fontSize: '1.375rem',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            color: '#111827',
        },
        headerSubtitle: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.25rem',
        },

        /* Social / OAuth buttons ────────────────────────────────────────── */
        socialButtonsBlockButton: {
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            color: '#374151',
            padding: '0.625rem 1rem',
            // Hover handled in index.css via .cl-socialButtonsBlockButton:hover
            transition: 'border-color 150ms, background-color 150ms, color 150ms',
        },
        socialButtonsBlockButtonText: {
            fontWeight: '600',
            fontSize: '0.875rem',
        },

        /* Divider ───────────────────────────────────────────────────────── */
        dividerRow: {
            marginTop: '1rem',
            marginBottom: '1rem',
        },
        dividerLine: {
            backgroundColor: '#f3f4f6',
        },
        dividerText: {
            color: '#9ca3af',
            fontSize: '0.6875rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
        },

        /* Form fields ───────────────────────────────────────────────────── */
        formFieldLabel: {
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#374151',
            letterSpacing: '-0.01em',
        },
        formFieldInput: {
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#111827',
            fontSize: '0.9375rem',
            borderRadius: '0.75rem',
            padding: '0.625rem 0.875rem',
            // Focus handled in index.css via .cl-formFieldInput:focus
            transition: 'border-color 150ms, box-shadow 150ms',
        },
        formFieldInputShowPasswordButton: {
            color: '#9ca3af',
            // Hover handled in index.css
        },

        /* Primary CTA button ────────────────────────────────────────────── */
        formButtonPrimary: {
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.9375rem',
            borderRadius: '0.75rem',
            padding: '0.6875rem 1.5rem',
            border: 'none',
            boxShadow:
                '0 4px 6px -1px rgba(249,115,22,0.15), 0 2px 4px -2px rgba(249,115,22,0.1)',
            // Hover handled in index.css via .cl-formButtonPrimary:hover
            transition: 'background-color 150ms, box-shadow 150ms, transform 100ms',
        },

        /* Secondary button (e.g. Back) ──────────────────────────────────── */
        formButtonReset: {
            color: '#6b7280',
            fontWeight: '600',
            fontSize: '0.875rem',
        },

        /* Footer — "Don't have an account? Sign up" ─────────────────────── */
        footerAction: {
            borderTop: '1px solid #f9fafb',
            paddingTop: '1rem',
            marginTop: '0.5rem',
        },
        footerActionText: {
            color: '#6b7280',
            fontSize: '0.875rem',
        },
        footerActionLink: {
            color: '#f97316',
            fontWeight: '600',
            fontSize: '0.875rem',
            // Hover handled in index.css
        },

        /* Forgot password / resend links ────────────────────────────────── */
        formFieldAction: {
            color: '#f97316',
            fontSize: '0.8125rem',
            fontWeight: '600',
        },
        formResendCodeLink: {
            color: '#f97316',
            fontWeight: '600',
            fontSize: '0.875rem',
        },

        /* Error / alert states ───────────────────────────────────────────── */
        alert: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
        },
        alertText: {
            color: '#dc2626',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        formFieldError: {
            color: '#ef4444',
            fontSize: '0.8125rem',
            marginTop: '0.25rem',
        },

        /* OTP / verification code inputs ────────────────────────────────── */
        otpCodeFieldInput: {
            border: '1px solid #e5e7eb',
            borderRadius: '0.625rem',
            fontWeight: '700',
            fontSize: '1.25rem',
            color: '#111827',
            backgroundColor: '#ffffff',
            // Active state handled via .cl-otpCodeFieldInput:focus in index.css
        },

        /* Badges (e.g. "Verified") ───────────────────────────────────────── */
        badge: {
            backgroundColor: '#fff7ed',
            color: '#ea580c',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.125rem 0.625rem',
        },

        /* Identity preview (email shown before password step) ───────────── */
        identityPreviewText: {
            color: '#374151',
            fontWeight: '600',
            fontSize: '0.9375rem',
        },
        identityPreviewEditButton: {
            color: '#f97316',
            fontWeight: '600',
            fontSize: '0.875rem',
        },

        /* Nav / back button inside multi-step flows ─────────────────────── */
        navbarButton: {
            color: '#6b7280',
            fontWeight: '600',
        },
    },
}
