# PVP Login Page — Minimal Premium Design

---

# DESIGN DIRECTION

The login page must feel:

* minimal
* modern
* secure
* professional
* elegant
* institutional

Inspired by:

* Linear
* Vercel
* Apple
* modern enterprise dashboards

The design should be simple and clean.

Avoid:

* complex layouts
* too many animations
* overloaded backgrounds
* too many cards
* futuristic overload
* unnecessary visual effects

---

# PAGE STRUCTURE

Use a centered layout.

```txt
---------------------------------
|                               |
|                               |
|        PVP LOGO              |
|                               |
|      Login Glass Card         |
|                               |
|                               |
---------------------------------
```

The entire page should focus only on:

* branding
* authentication
* simplicity
* readability

---

# BACKGROUND DESIGN

## Background Style

Use:

* pure black background
* very subtle emerald gradient
* soft lighting only

Example:

```css
background:
radial-gradient(circle at top left,
rgba(0,98,51,0.08), transparent 30%),
#000000;
```

Do NOT:

* use particles
* use heavy effects
* use strong glows
* overload the page

---

# LOGO SECTION

## Placement

Centered above the login card.

Spacing:

```css
margin-bottom: 32px;
```

---

## Typography

Main Title:

```txt
PVP Electoral Management System
```

Style:

```css
font-size: 28px;
font-weight: 700;
color: white;
```

Subtitle:

```txt
Secure Administrative Access
```

Style:

```css
font-size: 14px;
color: #a1a1aa;
```

---

# LOGIN CARD

## Card Style

Use a single minimal glass card.

The card should feel:

* clean
* elegant
* lightweight
* premium

---

## Card Styling

```css
background: rgba(15,15,18,0.75);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 24px;
padding: 40px;
width: 100%;
max-width: 420px;
```

---

# LOGIN HEADER

## Structure

```txt
Welcome Back
Authenticate to continue
```

---

## Typography

Title:

```css
font-size: 26px;
font-weight: 700;
color: white;
```

Subtitle:

```css
font-size: 14px;
color: #a1a1aa;
margin-top: 6px;
```

---

# INPUT DESIGN

## Input Style

Use:

* dark transparent inputs
* soft borders
* subtle focus glow
* rounded corners
* clean spacing

---

## Input Example

```css
height: 54px;
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 14px;
padding: 0 16px;
color: white;
```

---

## Focus State

```css
border-color: rgba(0,168,107,0.5);
box-shadow:
0 0 0 4px rgba(0,168,107,0.08);
```

---

# LOGIN BUTTON

## Style

Simple premium green button.

```css
height: 54px;
border-radius: 14px;
background:
linear-gradient(
135deg,
#006233,
#008c5a
);
font-weight: 600;
color: white;
```

---

## Hover Effect

```css
transform: translateY(-1px);
box-shadow:
0 8px 20px rgba(0,98,51,0.25);
```

Keep hover subtle.

---

# ADDITIONAL LINKS

Place under button:

```txt
Forgot Password?
```

Style:

* muted text
* subtle hover
* small typography

---

# SECURITY FOOTER

At the bottom of the card add:

```txt
Secure Government Infrastructure
```

With:

* small shield icon
* muted zinc text
* minimal styling

---

# ANIMATIONS

Use only subtle animations:

* fade-in page
* soft hover transitions
* smooth input focus
* button hover

Avoid:

* floating cards
* complex motion
* cinematic effects
* exaggerated animations

---

# RESPONSIVE DESIGN

## Mobile

On mobile:

* keep everything centered
* reduce padding
* maintain clean spacing
* full-width card with margins

---

# FINAL DESIGN FEEL

The login page should feel like:

* a premium enterprise platform
* a modern government portal
* clean and trustworthy
* simple but refined
* elegant without complexity

The user should immediately feel:

* clarity
* security
* professionalism
* ease of access

---

# END
