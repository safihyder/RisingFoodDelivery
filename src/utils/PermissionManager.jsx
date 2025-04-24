import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export const checkAndRequestLocationPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Not running on a native platform, skipping permissions check');
        return { location: 'granted' }; // For web, we'll handle this with the browser's built-in prompt
    }

    try {
        console.log('Checking location permissions...');
        // First check the current permission status
        const permissionStatus = await Geolocation.checkPermissions();
        console.log('Current permission status:', permissionStatus);

        // If permissions aren't granted, request them
        if (permissionStatus.location !== 'granted') {
            console.log('Requesting location permissions...');
            console.log('=== PERMISSION DIALOG SHOULD APPEAR NOW ===');

            try {
                const requestResult = await Geolocation.requestPermissions({
                    permissions: ['location', 'coarseLocation', 'fineLocation']
                });
                console.log('Permission request result:', requestResult);
                return requestResult;
            } catch (permError) {
                console.error('Error requesting permissions:', permError);
                return { location: 'denied' };
            }
        }

        return permissionStatus;
    } catch (error) {
        console.error('Error checking/requesting location permissions:', error);
        return { location: 'denied' };
    }
};

export const getCurrentPosition = async () => {
    try {
        // First ensure we have permissions
        const permissionStatus = await checkAndRequestLocationPermissions();

        if (permissionStatus.location !== 'granted') {
            console.log('Location permission not granted');
            return null;
        }

        console.log('Getting current position...');
        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
        });
        console.log('Position obtained:', position);
        return position;
    } catch (error) {
        console.error('Error getting position:', error);
        return null;
    }
};

// Force location permission prompt directly
export const forceLocationPermissionPrompt = async () => {
    console.log('Forcing location permission prompt...');

    if (!Capacitor.isNativePlatform()) {
        console.log('Not on native platform, using browser geolocation');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => console.log('Browser permission granted'),
                (err) => console.error('Browser permission error:', err)
            );
        }
        return;
    }

    try {
        // Check current permissions first
        const currentPermissions = await Geolocation.checkPermissions();
        console.log('Current permissions:', currentPermissions);

        if (currentPermissions.location === 'granted') {
            console.log('Permission already granted');
            return currentPermissions;
        }

        console.log('Requesting permissions explicitly...');
        return await Geolocation.requestPermissions({
            permissions: ['location', 'coarseLocation', 'fineLocation']
        });
    } catch (error) {
        console.error('Force permission request error:', error);
        return { location: 'denied' };
    }
}; 