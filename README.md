# Sarajevo Events

A mobile and web platform for discovering events in Sarajevo.

## Overview

Sarajevo Events is designed to provide a simple way to find parties, concerts, and other events in the city. Instead of checking multiple social media pages, users can explore events in one place.

The system includes a mobile app for users and an admin panel for managing events.

## Features

### Mobile App
- Browse events
- View event details
- Map view with event locations
- Save events to favorites

### Admin Panel
- Add and edit events
- Approve or reject events

### Backend
- Firebase (Firestore)
- Only approved events are shown in the app

## Tech Stack

- React Native (Expo)
- React (Vite)
- Firebase
- TypeScript

## Status

This project is currently in development.

## Running the project

```bash
# Mobile App
cd SarajevoEvents
npm install
npx expo start

# Admin Panel
cd ../admin-panel
npm install
npm run dev

