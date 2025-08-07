// Autonomous Navigation System - Ultimate Professional Version - Enhanced
class AutonomousNavigationSystem {
    constructor() {
        // Core vehicle state with realistic specifications
        this.rover = {
            x: 100,
            y: 100,
            heading: 0, // radians for smooth calculations
            speed: 0,
            targetSpeed: 0,
            maxSpeed: 4.0, // Increased for better visibility
            cruiseSpeed: 2.7,
            acceleration: 0.8,
            deceleration: 1.2,
            turningRate: 2.0, // Increased for faster turns
            battery: 100,
            powerConsumption: 110,
            isMoving: false,
            currentWaypoint: 0,
            arrivalThreshold: 25, // Increased threshold for better waypoint detection
            wheelRotation: 0,
            suspensionOffset: 0,
            tracks: [],
            taskAnimation: { type: null, startTime: 0, duration: 0, progress: 0 }
        };
        // Mission state with comprehensive tracking
        this.mission = {
            profile: 'geological',
            waypoints: [],
            currentWaypoint: 0,
            isActive: false,
            isPaused: false,
            startTime: null,
            totalDistance: 0,
            efficiency: 100,
            completedTasks: 0,
            errors: 0,
            estimatedTimeRemaining: 0,
            realtimeStatus: 'Rover is idle.'
        };
        // Environment simulation
        this.environment = {
            terrain: 'surface',
            temperature: 20, // Celsius
        };
        // System health monitoring
        this.systemHealth = {
            cpu: 25,
            memory: 45,
            temperature: 35,
            communication: 98,
            navigation: 100,
            powerSystem: 100
        };
        // Sensor systems with realistic specifications
        this.sensors = {
            navCameras: { active: true, count: 4, resolution: '1024x1024', power: 8, health: 100 },
            hazardCameras: { active: true, count: 8, fov: 124, power: 12, health: 100 },
            lidar: { active: true, range: 120, accuracy: 0.01, power: 85, health: 100 },
            radar: { active: true, frequency: 24, range: 200, power: 35, health: 100 },
            imu: { active: true, stability: 0.1, rate: 100, power: 3, health: 100 },
            gps: { active: true, accuracy: 0.014, rate: 10, power: 6, health: 100 }
        };
        // Mission profiles from the data
        this.missionProfiles = {
            geological: {
                name: "Geological Survey",
                duration: 4.5,
                distance: 150,
                waypoints: [
                    { x: 100, y: 100, task: "Start Position", duration: 2 },
                    { x: 180, y: 150, task: "Soil Sample", duration: 25 },
                    { x: 250, y: 120, task: "Rock Analysis", duration: 30 },
                    { x: 320, y: 180, task: "Geological Imaging", duration: 20 },
                    { x: 400, y: 140, task: "Core Drilling", duration: 45 },
                    { x: 450, y: 220, task: "Atmospheric Measurement", duration: 15 },
                    { x: 380, y: 280, task: "Documentation", duration: 20 }
                ]
            },
            rescue: {
                name: "Search & Rescue",
                duration: 2.0,
                distance: 200,
                waypoints: [
                    { x: 100, y: 100, task: "Deployment", duration: 1 },
                    { x: 160, y: 140, task: "Search Area 1", duration: 15 },
                    { x: 220, y: 180, task: "Search Area 2", duration: 20 },
                    { x: 280, y: 160, task: "Target Investigation", duration: 30 },
                    { x: 340, y: 200, task: "Casualty Assessment", duration: 25 },
                    { x: 400, y: 250, task: "Emergency Beacon", duration: 5 }
                ]
            },
            infrastructure: {
                name: "Infrastructure Inspection",
                duration: 6.0,
                distance: 300,
                waypoints: [
                    { x: 100, y: 100, task: "Calibration", duration: 5 },
                    { x: 140, y: 130, task: "Pipeline Inspection", duration: 40 },
                    { x: 180, y: 170, task: "Valve Assessment", duration: 30 },
                    { x: 220, y: 150, task: "Structural Scan", duration: 35 },
                    { x: 260, y: 190, task: "Thermal Imaging", duration: 25 },
                    { x: 300, y: 220, task: "Vibration Analysis", duration: 30 },
                    { x: 340, y: 210, task: "Corrosion Detection", duration: 35 },
                    { x: 380, y: 250, task: "Final Report", duration: 15 }
                ]
            }
        };
        // Canvas and rendering
        this.canvas = null;
        this.ctx = null;
        this.chart = null;
        this.animationId = null;
        this.lastTime = 0;
        this.updateRate = 60; // 60 FPS target

        // Telemetry data for charts
        this.telemetryData = {
            mission_progress: {
                labels: [],
                datasets: [
                    { label: 'Distance (m)', data: [], borderColor: '#1FB8CD', backgroundColor: 'rgba(31, 184, 205, 0.1)' },
                    { label: 'Speed (m/s)', data: [], borderColor: '#FFC185', backgroundColor: 'rgba(255, 193, 133, 0.1)' }
                ]
            },
            system_health: {
                labels: [],
                datasets: [
                    { label: 'CPU (%)', data: [], borderColor: '#B4413C', backgroundColor: 'rgba(180, 65, 60, 0.1)' },
                    { label: 'Memory (%)', data: [], borderColor: '#ECEBD5', backgroundColor: 'rgba(236, 235, 213, 0.1)' },
                    { label: 'Temperature (°C)', data: [], borderColor: '#5D878F', backgroundColor: 'rgba(93, 135, 143, 0.1)' }
                ]
            },
            power_consumption: {
                labels: [],
                datasets: [
                    { label: 'Power (W)', data: [], borderColor: '#DB4545', backgroundColor: 'rgba(219, 69, 69, 0.1)' },
                    { label: 'Battery (%)', data: [], borderColor: '#D2BA4C', backgroundColor: 'rgba(210, 186, 76, 0.1)' }
                ]
            },
            environmental: {
                labels: [],
                datasets: [
                    { label: 'Temperature (°C)', data: [], borderColor: '#964325', backgroundColor: 'rgba(150, 67, 37, 0.1)' },
                    { label: 'Solar Irradiance', data: [], borderColor: '#944454', backgroundColor: 'rgba(148, 68, 84, 0.1)' }
                ]
            }
        };
        this.obstacles = [
            { x: 200, y: 150, radius: 20, type: 'boulder' },
            { x: 300, y: 120, radius: 15, type: 'pit' },
            { x: 180, y: 250, radius: 18, type: 'rock_formation' }
        ];
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Autonomous Navigation System...');

        // Show loading with progress
        this.showLoading();
        await this.simulateSystemStartup();

        // Initialize components with error handling
        try {
            this.setupCanvas();
            this.setupChart();
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showAlert('System initialization failed. Please reload the page.');
            return;
        }

        // Load default mission profile and ensure waypoints are visible
        this.loadMissionProfile('geological');

        // Start systems
        this.startTelemetryUpdates();
        this.startSystemHealthMonitoring();
        this.startGameLoop();

        // Hide loading
        this.hideLoading();

        console.log('✅ Autonomous Navigation System initialized successfully');
        console.log(`Loaded ${this.mission.waypoints.length} waypoints for geological survey mission`);
    }

    async simulateSystemStartup() {
        const stages = [
            'Establishing communication link...',
            'Initializing rover systems...',
            'Calibrating navigation sensors...',
            'Loading mission parameters...',
            'Verifying system integrity...',
            'Ready for mission deployment'
        ];
        for (let i = 0; i < stages.length; i++) {
            document.getElementById('loadingText').textContent = stages[i];
            const progress = ((i + 1) / stages.length) * 100;
            document.getElementById('loadingBar').style.width = `${progress}%`;
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    setupCanvas() {
        this.canvas = document.getElementById('roverCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Failed to get canvas context');
        }

        // Set proper canvas resolution
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * (window.devicePixelRatio || 1);
        this.canvas.height = rect.height * (window.devicePixelRatio || 1);
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

        // Canvas event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);
            document.getElementById('mouseCoords').textContent = `Cursor: ${x}, ${y}`;
        });
        this.canvas.addEventListener('click', (e) => {
            if (this.mission.isActive) return; // Can't add waypoints during mission

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log('Canvas clicked at:', x, y);
        });
        console.log('Canvas setup completed with dimensions:', this.canvas.width, 'x', this.canvas.height);
    }

    setupChart() {
        const chartCanvas = document.getElementById('telemetryChart');
        if (!chartCanvas) {
            throw new Error('Telemetry chart canvas not found');
        }
        const ctx = chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Distance (m)',
                    data: [],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 }, // Disable animations for performance
                interaction: { intersect: false, mode: 'index' },
                scales: {
                    x: {
                        grid: { color: 'rgba(167, 169, 169, 0.2)' },
                        ticks: { color: '#A7A9A9', maxTicksLimit: 6 }
                    },
                    y: {
                        grid: { color: 'rgba(167, 169, 169, 0.2)' },
                        ticks: { color: '#A7A9A9' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#A7A9A9' } },
                    tooltip: {
                        backgroundColor: 'rgba(31, 33, 33, 0.9)',
                        titleColor: '#32B3CD',
                        bodyColor: '#A7A9A9'
                    }
                }
            }
        });
        console.log('Chart setup completed');
    }

    setupEventListeners() {
        // Mission controls
        this.attachEvent('startMissionBtn', 'click', () => this.startMission());
        this.attachEvent('pauseMissionBtn', 'click', () => this.pauseMission());
        this.attachEvent('stopMissionBtn', 'click', () => this.stopMission());
        this.attachEvent('emergencyBtn', 'click', () => this.emergencyStop());

        // Mission profile
        this.attachEvent('loadProfileBtn', 'click', () => this.loadSelectedProfile());
        this.attachEvent('missionProfile', 'change', (e) => this.updateProfileInfo(e.target.value));

        // Display controls
        this.attachEvent('resetViewBtn', 'click', () => this.resetView());
        this.attachEvent('centerRoverBtn', 'click', () => this.centerOnRover());

        // Chart controls
        this.attachEvent('chartTypeSelect', 'change', (e) => this.updateChart(e.target.value));

        // Waypoint controls
        this.attachEvent('clearWaypointsBtn', 'click', () => this.clearWaypoints());
        this.attachEvent('optimizePathBtn', 'click', () => this.optimizePath());

        // Modal controls
        this.attachEvent('acknowledgeBtn', 'click', () => this.hideModal('emergencyModal'));
        this.attachEvent('emergencyStopBtn', 'click', () => {
            this.emergencyStop();
            this.hideModal('emergencyModal');
        });
        this.attachEvent('newMissionBtn', 'click', () => {
            this.resetMission();
            this.hideModal('successModal');
        });
        this.attachEvent('closeSuccessBtn', 'click', () => this.hideModal('successModal'));

        console.log('Event listeners setup completed');
    }

    attachEvent(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element ${elementId} not found for event ${eventType}`);
            return;
        }
        element.addEventListener(eventType, handler);
    }

    loadMissionProfile(profileKey) {
        console.log(`Loading mission profile: ${profileKey}`);
        const profile = this.missionProfiles[profileKey];
        if (!profile) {
            console.error(`Profile ${profileKey} not found`);
            this.showAlert(`Mission profile "${profileKey}" not found. Please select another.`);
            return;
        }
        this.mission.profile = profileKey;
        this.mission.waypoints = profile.waypoints.map(wp => ({
            ...wp,
            completed: false,
            taskStartTime: null
        }));

        // Reset rover to starting position
        const startWaypoint = profile.waypoints[0];
        this.rover.x = startWaypoint.x;
        this.rover.y = startWaypoint.y;
        this.rover.currentWaypoint = 0;

        this.updateProfileInfo(profileKey);
        this.updateWaypointDisplay();
        this.updateMissionStatus();

        console.log(`✅ Loaded mission profile: ${profile.name} with ${profile.waypoints.length} waypoints`);
    }

    loadSelectedProfile() {
        const selectedProfile = document.getElementById('missionProfile').value;
        this.loadMissionProfile(selectedProfile);
    }

    updateProfileInfo(profileKey = null) {
        const selectedProfile = profileKey || document.getElementById('missionProfile').value;
        const profile = this.missionProfiles[selectedProfile];

        if (profile) {
            document.getElementById('profileDuration').textContent = `${profile.duration} hours`;
            document.getElementById('profileDistance').textContent = `${profile.distance} meters`;
            document.getElementById('profileWaypoints').textContent = `${profile.waypoints.length} locations`;
            console.log(`Profile info updated for ${selectedProfile}`);
        }
    }

    startMission() {
        console.log('🚀🚀🚀 STARTING AUTONOMOUS NAVIGATION MISSION 🚀🚀🚀');

        if (this.mission.waypoints.length === 0) {
            console.error('No waypoints available for mission');
            this.showAlert('No mission waypoints loaded. Please load a mission profile first.');
            return;
        }
        if (this.rover.battery < 20) {
            this.showAlert('Battery too low to start mission. Please recharge.');
            return;
        }
        console.log(`Mission waypoints: ${this.mission.waypoints.length}`);
        this.mission.isActive = true;
        this.mission.isPaused = false;
        this.mission.startTime = Date.now();
        this.mission.currentWaypoint = 1; // Start with waypoint 1 (0 is current position)
        this.mission.totalDistance = 0;
        this.mission.completedTasks = 0;
        this.mission.errors = 0;
        this.mission.efficiency = 100;

        this.rover.isMoving = true;
        this.rover.currentWaypoint = 1; // Start moving to waypoint 1
        this.rover.tracks = [];
        this.rover.speed = 0;
        this.rover.targetSpeed = this.rover.cruiseSpeed;

        // Mark first waypoint as completed (starting position)
        this.mission.waypoints[0].completed = true;
        this.mission.completedTasks = 1;

        // Reset other waypoints
        for (let i = 1; i < this.mission.waypoints.length; i++) {
            this.mission.waypoints[i].completed = false;
            this.mission.waypoints[i].taskStartTime = null;
        }

        // Update UI immediately
        this.updateMissionControls();
        this.updateMissionStatus();
        this.updateWaypointDisplay();
        console.log('✅ Mission started successfully!');
    }

    pauseMission() {
        if (!this.mission.isActive) return;

        this.mission.isPaused = !this.mission.isPaused;
        this.rover.isMoving = !this.mission.isPaused;

        document.getElementById('pauseMissionBtn').innerHTML = this.mission.isPaused
            ? '<span class="btn-icon">▶</span>RESUME'
            : '<span class="btn-icon">⏸</span>PAUSE';

        console.log(`Mission ${this.mission.isPaused ? 'paused' : 'resumed'}`);
    }

    stopMission() {
        console.log('⏹ Mission stopped by user');

        this.mission.isActive = false;
        this.mission.isPaused = false;
        this.rover.isMoving = false;
        this.rover.speed = 0;
        this.rover.targetSpeed = 0;

        this.updateMissionControls();
        this.updateMissionStatus();
    }

    emergencyStop() {
        console.log('🚨 EMERGENCY STOP ACTIVATED');

        this.stopMission();
        this.mission.errors++;
        this.showAlert('Emergency stop activated. All rover systems halted.');
    }

    resetMission() {
        this.stopMission();
        this.loadSelectedProfile();
        console.log('🔄 Mission reset');
    }

    // CRITICAL: GUARANTEED ROVER MOVEMENT SYSTEM - ENHANCED
    updateRoverMovement(deltaTime) {
        // Always update rover animation even when stopped
        this.updateRoverAnimation(deltaTime);

        if (!this.mission.isActive || this.mission.isPaused) {
            // Decelerate when not active
            if (this.rover.speed > 0) {
                this.rover.speed = Math.max(0, this.rover.speed - this.rover.deceleration * deltaTime);
            }
            this.mission.realtimeStatus = this.mission.isPaused ? 'Mission paused.' : 'Mission idle.';
            this.updateRealtimeStatus();
            return;
        }

        if (!this.rover.isMoving) {
            this.mission.realtimeStatus = 'Performing task at waypoint.';
            this.updateRealtimeStatus();
            return;
        }

        // Get current target waypoint
        if (this.rover.currentWaypoint >= this.mission.waypoints.length) {
            this.completeMission();
            return;
        }

        const targetWaypoint = this.mission.waypoints[this.rover.currentWaypoint];
        if (!targetWaypoint) {
            console.error('Target waypoint not found:', this.rover.currentWaypoint);
            this.mission.errors++;
            this.stopMission();
            return;
        }

        // Calculate distance and direction to target
        const dx = targetWaypoint.x - this.rover.x;
        const dy = targetWaypoint.y - this.rover.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

        // Check if waypoint is reached
        if (distanceToTarget < this.rover.arrivalThreshold) {
            this.reachWaypoint(targetWaypoint);
            return;
        }

        // Calculate target heading
        const targetHeading = Math.atan2(dy, dx);

        // Smooth heading transition
        let headingDiff = targetHeading - this.rover.heading;
        if (headingDiff > Math.PI) headingDiff -= 2 * Math.PI;
        if (headingDiff < -Math.PI) headingDiff += 2 * Math.PI;

        // Clamp the turn amount to max turn rate
        const maxTurn = this.rover.turningRate * deltaTime;
        const turn = Math.sign(headingDiff) * Math.min(Math.abs(headingDiff), maxTurn);
        this.rover.heading += turn;

        // Normalize heading to [-PI, PI]
        if (this.rover.heading > Math.PI) this.rover.heading -= 2 * Math.PI;
        if (this.rover.heading < -Math.PI) this.rover.heading += 2 * Math.PI;

        // Set target speed, slow down when approaching waypoint
        this.rover.targetSpeed = this.rover.cruiseSpeed * Math.min(1, distanceToTarget / (this.rover.arrivalThreshold * 2));

        // Smooth acceleration/deceleration
        const speedDiff = this.rover.targetSpeed - this.rover.speed;
        const accel = speedDiff > 0 ? this.rover.acceleration : this.rover.deceleration;
        this.rover.speed += Math.sign(speedDiff) * Math.min(Math.abs(speedDiff), accel * deltaTime);
        this.rover.speed = Math.max(0, Math.min(this.rover.maxSpeed, this.rover.speed));

        // GUARANTEED MOVEMENT: Force minimum speed when mission is active
        if (this.rover.speed < 0.5 && this.mission.isActive && this.rover.isMoving) {
            this.rover.speed = 0.5; // Adjusted minimum for consistency
        }

        // Move rover with GUARANTEED movement
        const moveDistance = this.rover.speed * deltaTime;
        if (moveDistance > 0) {
            const newX = this.rover.x + Math.cos(this.rover.heading) * moveDistance;
            const newY = this.rover.y + Math.sin(this.rover.heading) * moveDistance;

            // Simple boundary check (keep rover on screen)
            const margin = 50;
            const canvasRect = this.canvas.getBoundingClientRect();
            const canMoveX = newX >= margin && newX <= (canvasRect.width - margin);
            const canMoveY = newY >= margin && newY <= (canvasRect.height - margin);

            if (canMoveX && canMoveY) {
                // Check for obstacles
                if (this.isPathClear(newX, newY)) {
                    // Add track point before moving
                    this.rover.tracks.push({
                        x: this.rover.x,
                        y: this.rover.y,
                        timestamp: Date.now(),
                        alpha: 1.0
                    });

                    // Limit track length for performance
                    if (this.rover.tracks.length > 500) { // Increased limit for longer trails
                        this.rover.tracks.shift();
                    }

                    // Update position - THIS IS THE CRITICAL MOVEMENT
                    this.rover.x = newX;
                    this.rover.y = newY;
                    this.mission.totalDistance += moveDistance;
                } else {
                    console.warn('Obstacle detected, evading...');
                    this.evadeObstacle();
                    this.mission.realtimeStatus = 'Evading obstacle.';
                    this.updateRealtimeStatus();
                }
            } else {
                console.warn('Rover hit boundary, adjusting course');
                this.evadeObstacle(); // Use same evasion as obstacles for consistency
                this.mission.realtimeStatus = 'Adjusting course at boundary.';
                this.updateRealtimeStatus();
            }
        }

        // Update realtime status for movement
        this.mission.realtimeStatus = `Moving to waypoint ${this.rover.currentWaypoint + 1} (${targetWaypoint.task}). Distance remaining: ${Math.round(distanceToTarget)}m.`;
        this.updateRealtimeStatus();

        // Update power systems
        this.updatePowerSystems(deltaTime);

        // Check critical conditions
        if (this.rover.battery <= 0) {
            this.showAlert('Battery depleted. Mission aborted.');
            this.emergencyStop();
        }
    }

    isPathClear(newX, newY) {
        // Simple obstacle collision check
        for (const obstacle of this.obstacles) {
            const dx = newX - obstacle.x;
            const dy = newY - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < obstacle.radius + 20) { // Rover size buffer
                return false;
            }
        }
        return true;
    }

    evadeObstacle() {
        // Simple evasion: turn slightly random direction
        this.rover.heading += Math.PI * 0.25 * (Math.random() > 0.5 ? 1 : -1);
        this.mission.errors += 0.1; // Minor penalty
        // Normalize heading
        this.rover.heading = this.rover.heading % (2 * Math.PI);
        if (this.rover.heading > Math.PI) this.rover.heading -= 2 * Math.PI;
        if (this.rover.heading < -Math.PI) this.rover.heading += 2 * Math.PI;
    }

    reachWaypoint(waypoint) {
        console.log(`📍 WAYPOINT REACHED: ${waypoint.task} at (${Math.round(waypoint.x)}, ${Math.round(waypoint.y)})`);

        waypoint.completed = true;
        waypoint.taskStartTime = Date.now();
        this.mission.completedTasks++;

        // Start task animation
        this.rover.taskAnimation = {
            type: waypoint.task,
            startTime: Date.now(),
            duration: waypoint.duration * 1000,
            progress: 0
        };

        // Simulate task duration with animation
        this.rover.isMoving = false;
        this.mission.realtimeStatus = `Performing task: ${waypoint.task}.`;
        this.updateRealtimeStatus();

        setTimeout(() => {
            this.rover.taskAnimation = { type: null, startTime: 0, duration: 0, progress: 0 };
            this.rover.isMoving = true;
            // Move to next waypoint
            this.rover.currentWaypoint++;
            if (this.rover.currentWaypoint >= this.mission.waypoints.length) {
                this.completeMission();
            }
            this.updateWaypointDisplay();
            this.updateMissionStatus();
        }, waypoint.duration * 1000); // Convert minutes to ms, but scaled down for sim
    }

    completeMission() {
        console.log('🎉🎉🎉 MISSION COMPLETED SUCCESSFULLY! 🎉🎉🎉');

        this.mission.isActive = false;
        this.rover.isMoving = false;
        this.rover.speed = 0;
        this.rover.targetSpeed = 0;

        // Calculate final efficiency
        const missionTime = (Date.now() - this.mission.startTime) / 1000;
        const expectedTime = this.missionProfiles[this.mission.profile].duration * 3600; // hours to seconds
        const timeEfficiency = Math.max(0, 100 - Math.max(0, (missionTime - expectedTime) / expectedTime * 100));
        const errorPenalty = this.mission.errors * 5;
        this.mission.efficiency = Math.max(0, Math.round(timeEfficiency - errorPenalty));

        this.updateMissionControls();
        this.updateMissionStatus();
        this.showMissionComplete();

        console.log(`Final mission stats: Distance: ${Math.round(this.mission.totalDistance)}m, Time: ${Math.round(missionTime)}s, Efficiency: ${this.mission.efficiency}%`);
    }

    updateRoverAnimation(deltaTime) {
        // Wheel rotation based on speed
        this.rover.wheelRotation += this.rover.speed * deltaTime * 0.1;

        // Suspension animation (simulating terrain) - smoothed to reduce flickering
        const terrainFactor = Math.sin(Date.now() * 0.001 * 0.5) * (this.rover.speed / this.rover.maxSpeed); // Slower oscillation
        this.rover.suspensionOffset = this.rover.suspensionOffset * 0.9 + terrainFactor * 2 * 0.1; // Smooth interpolation
    }

    updatePowerSystems(deltaTime) {
        // Battery consumption based on speed and systems
        const baseConsumption = 0.001; // %/second at idle
        const movementConsumption = (this.rover.speed / this.rover.maxSpeed) * 0.005;
        const systemsConsumption = Object.values(this.sensors)
            .filter(s => s.active)
            .reduce((sum, s) => sum + (s.power || 0), 0) * 0.0001;

        const totalConsumption = (baseConsumption + movementConsumption + systemsConsumption) * deltaTime;
        this.rover.battery = Math.max(0, this.rover.battery - totalConsumption);

        // Update power consumption display
        this.rover.powerConsumption = 110 + (this.rover.speed / this.rover.maxSpeed) * 200;

        // Low battery warning
        if (this.rover.battery < 20 && this.mission.isActive) {
            this.showAlert('Warning: Battery level critically low!');
        }
    }

    // ENHANCED PROFESSIONAL 3D ROVER VISUALIZATION
    drawCanvas() {
        if (!this.ctx) return;
        const canvas = this.canvas;
        const ctx = this.ctx;
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas with surface color
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, width, height);

        // Draw environment
        this.drawEnvironment(ctx, width, height);

        // Draw coordinate grid
        this.drawGrid(ctx, width, height);

        // Draw obstacles with 3D effect
        this.drawObstacles(ctx);

        // Draw rover tracks with fading effect
        this.drawRoverTracks(ctx);

        // Draw waypoint path
        this.drawWaypointPath(ctx);

        // Draw waypoints with professional styling
        this.drawWaypoints(ctx);

        // Draw rover with detailed 3D visualization
        this.drawDetailedRover(ctx);

        // Draw task animation if active
        if (this.rover.taskAnimation.type) {
            this.drawTaskAnimation(ctx);
        }

        // Draw HUD elements
        this.drawHUD(ctx, width, height);
    }

    drawTaskAnimation(ctx) {
        const progress = (Date.now() - this.rover.taskAnimation.startTime) / this.rover.taskAnimation.duration;
        this.rover.taskAnimation.progress = Math.min(progress, 1);

        ctx.save();
        ctx.translate(this.rover.x, this.rover.y);

        if (this.rover.taskAnimation.type.includes("Soil Sample") || this.rover.taskAnimation.type.includes("Core Drilling")) {
            // Animate sand particles being collected
            ctx.fillStyle = 'rgba(205, 133, 63, 0.8)';
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = Math.random() * 10 * this.rover.taskAnimation.progress;
                const size = Math.random() * 2 + 1;
                ctx.beginPath();
                ctx.arc(20 + Math.cos(angle) * dist, 0 + Math.sin(angle) * dist, size, 0, 2 * Math.PI);
                ctx.fill();
            }

            // Animate arm movement
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            const armAngle = -Math.PI / 2 * this.rover.taskAnimation.progress;
            ctx.beginPath();
            ctx.moveTo(20, 0);
            ctx.lineTo(20 + 20 * Math.cos(armAngle), 0 + 20 * Math.sin(armAngle));
            ctx.stroke();
        } else if (this.rover.taskAnimation.type.includes("Imaging") || this.rover.taskAnimation.type.includes("Analysis")) {
            // Scanning beam animation
            ctx.strokeStyle = 'rgba(30, 144, 255, 0.5)';
            ctx.lineWidth = 2;
            const beamLength = 30 * Math.sin(Math.PI * this.rover.taskAnimation.progress);
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(beamLength, -25);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(-beamLength, -25);
            ctx.stroke();
        } else {
            // Generic spinning animation for other tasks
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, 2 * Math.PI * this.rover.taskAnimation.progress);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawEnvironment(ctx, width, height) {
        // Atmosphere gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 139, 0.15)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Terrain features (optimized)
        ctx.fillStyle = 'rgba(34, 139, 34, 0.2)';
        for (let i = 0; i < 15; i++) {
            const x = (i * 73) % width;
            const y = (i * 137) % height;
            const size = 1 + (i % 3);
            ctx.fillRect(x, y, size, size);
        }
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.5;

        // Draw grid lines every 50 pixels
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw coordinate labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        for (let x = 50; x < width; x += 100) {
            ctx.fillText(x.toString(), x + 2, 15);
        }
        for (let y = 50; y < height; y += 100) {
            ctx.fillText(y.toString(), 5, y - 5);
        }
    }

    drawObstacles(ctx) {
        this.obstacles.forEach(obstacle => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(obstacle.x + 3, obstacle.y + 3, obstacle.radius, obstacle.radius * 0.5, 0, 0, 2 * Math.PI);
            ctx.fill();

            // Main obstacle with gradient
            const gradient = ctx.createRadialGradient(
                obstacle.x - 5, obstacle.y - 5, 0,
                obstacle.x, obstacle.y, obstacle.radius
            );
            gradient.addColorStop(0, '#8B4513');
            gradient.addColorStop(1, '#654321');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, 2 * Math.PI);
            ctx.fill();

            // Highlight
            ctx.fillStyle = 'rgba(205, 133, 63, 0.6)';
            ctx.beginPath();
            ctx.arc(obstacle.x - 3, obstacle.y - 3, obstacle.radius * 0.3, 0, 2 * Math.PI);
            ctx.fill();

            // Type label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(obstacle.type.toUpperCase(), obstacle.x, obstacle.y + obstacle.radius + 12);
        });
    }

    drawRoverTracks(ctx) {
        const now = Date.now();

        this.rover.tracks.forEach((track) => {
            const age = now - track.timestamp;
            const maxAge = 20000; // 20 seconds
            const alpha = Math.max(0, 1 - (age / maxAge));

            if (alpha > 0) {
                ctx.fillStyle = `rgba(139, 69, 19, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(track.x, track.y, 2, 0, 2 * Math.PI);
                ctx.fill();

                // Add tire tread marks
                ctx.fillStyle = `rgba(205, 133, 63, ${alpha * 0.3})`;
                ctx.fillRect(track.x - 1, track.y - 4, 2, 8);
                ctx.fillRect(track.x - 4, track.y - 1, 8, 2);
            }
        });

        // Clean up old tracks
        this.rover.tracks = this.rover.tracks.filter(track => (now - track.timestamp) < 20000);
    }

    drawWaypointPath(ctx) {
        if (this.mission.waypoints.length < 2) return;

        // Draw path between waypoints
        ctx.strokeStyle = 'rgba(31, 184, 205, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();

        for (let i = 0; i < this.mission.waypoints.length - 1; i++) {
            const current = this.mission.waypoints[i];
            const next = this.mission.waypoints[i + 1];

            if (i === 0) {
                ctx.moveTo(current.x, current.y);
            }
            ctx.lineTo(next.x, next.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw current path to active waypoint - BRIGHT GREEN
        if (this.mission.isActive && this.rover.currentWaypoint < this.mission.waypoints.length) {
            const targetWaypoint = this.mission.waypoints[this.rover.currentWaypoint];
            ctx.strokeStyle = '#00FF00'; // Bright green
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.rover.x, this.rover.y);
            ctx.lineTo(targetWaypoint.x, targetWaypoint.y);
            ctx.stroke();

            // Add distance label
            const midX = (this.rover.x + targetWaypoint.x) / 2;
            const midY = (this.rover.y + targetWaypoint.y) / 2;
            const distance = Math.sqrt((targetWaypoint.x - this.rover.x) ** 2 + (targetWaypoint.y - this.rover.y) ** 2);

            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(distance)}m`, midX, midY - 5);
        }
    }

    drawWaypoints(ctx) {
        this.mission.waypoints.forEach((waypoint, index) => {
            const isActive = index === this.rover.currentWaypoint && this.mission.isActive;
            const isCompleted = waypoint.completed;

            // Waypoint shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(waypoint.x + 2, waypoint.y + 2, 16, 0, 2 * Math.PI);
            ctx.fill();

            // Waypoint base circle
            let color = isCompleted ? '#32CD32' : isActive ? '#FFD700' : '#1FB8CD';
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 16, 0, 2 * Math.PI);
            ctx.fill();

            // Waypoint border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner circle for better contrast
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 12, 0, 2 * Math.PI);
            ctx.fill();

            // Waypoint number
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((index + 1).toString(), waypoint.x, waypoint.y);

            // Task label with background
            const taskText = waypoint.task.toUpperCase();
            const textWidth = ctx.measureText(taskText).width;

            // Background for text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(waypoint.x - textWidth/2 - 4, waypoint.y + 20, textWidth + 8, 14);

            // Task text
            ctx.fillStyle = color;
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(taskText, waypoint.x, waypoint.y + 22);

            // Active waypoint pulse effect
            if (isActive && this.mission.isActive) {
                const time = Date.now() * 0.005;
                const pulseRadius = 20 + Math.sin(time) * 6;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(waypoint.x, waypoint.y, pulseRadius, 0, 2 * Math.PI);
                ctx.stroke();

                // Secondary pulse
                const pulse2Radius = 25 + Math.sin(time + 1) * 4;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(waypoint.x, waypoint.y, pulse2Radius, 0, 2 * Math.PI);
                ctx.stroke();
            }

            // Completion checkmark
            if (isCompleted) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(waypoint.x - 6, waypoint.y);
                ctx.lineTo(waypoint.x - 2, waypoint.y + 4);
                ctx.lineTo(waypoint.x + 6, waypoint.y - 4);
                ctx.stroke();
            }
        });
    }

    drawDetailedRover(ctx) {
        ctx.save();
        ctx.translate(this.rover.x, this.rover.y);
        ctx.rotate(this.rover.heading);

        // Rover shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(-20, -15, 40, 30);

        // Main rover chassis with 3D effect
        const chassisGradient = ctx.createLinearGradient(-20, -15, 20, 15);
        chassisGradient.addColorStop(0, '#4682B4');
        chassisGradient.addColorStop(0.3, '#1E90FF');
        chassisGradient.addColorStop(0.7, '#1873CC');
        chassisGradient.addColorStop(1, '#0F4C81');

        ctx.fillStyle = chassisGradient;
        ctx.fillRect(-20, -15, 40, 30);

        // Chassis border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(-20, -15, 40, 30);

        // Solar panels with realistic detail
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(-24, -18, 48, 8);

        // Solar panel grid
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 1;
        for (let i = -20; i <= 20; i += 8) {
            ctx.beginPath();
            ctx.moveTo(i, -18);
            ctx.lineTo(i, -10);
            ctx.stroke();
        }

        // Panel border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(-24, -18, 48, 8);

        // Rocker-bogie suspension system with 6 wheels
        const wheelPositions = [
            [-18, -20 + this.rover.suspensionOffset], [0, -20 + this.rover.suspensionOffset], [18, -20 + this.rover.suspensionOffset], // Front wheels
            [-18, 20 + this.rover.suspensionOffset], [0, 20 + this.rover.suspensionOffset], [18, 20 + this.rover.suspensionOffset] // Rear wheels
        ];
        wheelPositions.forEach(([wx, wy], index) => {
            ctx.save();
            ctx.translate(wx, wy);
            ctx.rotate(this.rover.wheelRotation + (index * 0.1));

            // Wheel shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(1, 1, 6, 0, 2 * Math.PI);
            ctx.fill();

            // Main wheel
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, 2 * Math.PI);
            ctx.fill();

            // Wheel rim
            ctx.strokeStyle = '#666666';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Tire treads
            ctx.strokeStyle = '#555555';
            ctx.lineWidth = 1;
            for (let a = 0; a < 2 * Math.PI; a += Math.PI / 4) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
                ctx.lineTo(Math.cos(a) * 5, Math.sin(a) * 5);
                ctx.stroke();
            }

            ctx.restore();
        });

        // Camera mast with details
        ctx.fillStyle = '#555555';
        ctx.fillRect(-3, -25, 6, 12);

        // Mast joints
        ctx.fillStyle = '#777777';
        ctx.beginPath();
        ctx.arc(0, -22, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -16, 2, 0, 2 * Math.PI);
        ctx.fill();

        // Navigation cameras
        ctx.fillStyle = '#1E90FF';
        ctx.beginPath();
        ctx.arc(-2, -28, 2.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2, -28, 2.5, 0, 2 * Math.PI);
        ctx.fill();

        // Camera lenses
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-2, -28, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2, -28, 1.5, 0, 2 * Math.PI);
        ctx.fill();

        // Robotic arm with multiple segments
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Arm base
        ctx.beginPath();
        ctx.moveTo(20, -8);
        ctx.lineTo(26, -12);
        ctx.stroke();

        // Arm elbow joint
        ctx.fillStyle = '#AAAAAA';
        ctx.beginPath();
        ctx.arc(26, -12, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Arm extension
        ctx.beginPath();
        ctx.moveTo(26, -12);
        ctx.lineTo(32, -8);
        ctx.stroke();

        // End effector (drill/tool)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(32, -8, 2, 0, 2 * Math.PI);
        ctx.fill();

        // Scientific instruments
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(-15, -5, 8, 4);
        ctx.fillRect(7, -5, 8, 4);

        // Instrument labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SPEC', -11, -2);
        ctx.fillText('DRILL', 11, -2);

        // Direction indicator arrow
        ctx.fillStyle = this.mission.isActive ? '#00FF00' : '#FFD700';
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(28, -6);
        ctx.lineTo(28, -2);
        ctx.lineTo(35, -2);
        ctx.lineTo(35, 2);
        ctx.lineTo(28, 2);
        ctx.lineTo(28, 6);
        ctx.fill();

        // Status indicators
        const statusColor = this.mission.isActive ? '#32CD32' :
            this.rover.battery < 20 ? '#FF0000' : '#1FB8CD';

        // Main status light
        ctx.fillStyle = statusColor;
        ctx.beginPath();
        ctx.arc(0, 5, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Status light glow effect
        const glowGradient = ctx.createRadialGradient(0, 5, 0, 0, 5, 8);
        glowGradient.addColorStop(0, statusColor);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 5, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Communication antenna
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -15);
        ctx.lineTo(-12, -25);
        ctx.moveTo(-12, -25);
        ctx.lineTo(-15, -23);
        ctx.moveTo(-12, -25);
        ctx.lineTo(-9, -23);
        ctx.stroke();

        ctx.restore();

        // Rover identification label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.rover.x - 35, this.rover.y - 45, 70, 16);

        ctx.fillStyle = '#1FB8CD';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUTONOMOUS ROVER', this.rover.x, this.rover.y - 32);

        // Speed indicator
        ctx.fillStyle = this.mission.isActive ? '#00FF00' : '#CCCCCC';
        ctx.font = '10px monospace';
        ctx.fillText(`${this.rover.speed.toFixed(1)} m/s`, this.rover.x, this.rover.y + 45);
    }

    drawHUD(ctx, width, height) {
        // Mission progress overlay
        if (this.mission.isActive) {
            const progress = this.mission.completedTasks / Math.max(1, this.mission.waypoints.length);
            const progressWidth = width * 0.25;
            const progressX = width - progressWidth - 20;
            const progressY = height - 50;

            // Progress bar background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(progressX - 15, progressY - 35, progressWidth + 30, 45);

            // Progress bar frame
            ctx.strokeStyle = '#1FB8CD';
            ctx.lineWidth = 2;
            ctx.strokeRect(progressX - 15, progressY - 35, progressWidth + 30, 45);

            // Progress bar
            ctx.fillStyle = 'rgba(31, 184, 205, 0.3)';
            ctx.fillRect(progressX, progressY - 20, progressWidth, 12);
            ctx.fillStyle = '#1FB8CD';
            ctx.fillRect(progressX, progressY - 20, progressWidth * progress, 12);

            // Progress text
            ctx.fillStyle = '#1FB8CD';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(
                `MISSION: ${Math.round(progress * 100)}%`,
                progressX + progressWidth / 2,
                progressY + 5
            );

            // Mission status
            const statusText = this.mission.isPaused ? 'PAUSED' : 'ACTIVE';
            ctx.fillStyle = this.mission.isPaused ? '#FFD700' : '#32CD32';
            ctx.font = '10px monospace';
            ctx.fillText(statusText, progressX + progressWidth / 2, progressY + 18);
        }

        // Rover telemetry overlay (top-left)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 200, 80);

        ctx.strokeStyle = '#1FB8CD';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 200, 80);

        ctx.fillStyle = '#1FB8CD';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`POS: (${Math.round(this.rover.x)}, ${Math.round(this.rover.y)})`, 15, 25);
        ctx.fillText(`SPD: ${this.rover.speed.toFixed(2)} m/s`, 15, 40);
        ctx.fillText(`HDG: ${Math.round(this.rover.heading * 180 / Math.PI)}°`, 15, 55);
        ctx.fillText(`BAT: ${Math.round(this.rover.battery)}%`, 15, 70);
        ctx.fillText(`DST: ${Math.round(this.mission.totalDistance)}m`, 120, 25);

        const waypointText = this.rover.currentWaypoint < this.mission.waypoints.length ?
            `WP: ${this.rover.currentWaypoint}/${this.mission.waypoints.length}` : 'COMPLETE';
        ctx.fillText(waypointText, 120, 40);
    }

    // Utility and UI Methods
    clearWaypoints() {
        if (this.mission.isActive) return;

        this.mission.waypoints = [];
        this.rover.currentWaypoint = 0;
        this.updateWaypointDisplay();
        this.updateMissionStatus();
    }

    optimizePath() {
        if (this.mission.isActive || this.mission.waypoints.length < 3) return;

        // Simple nearest neighbor optimization
        const startPoint = this.mission.waypoints[0];
        const unvisited = [...this.mission.waypoints.slice(1)];
        const optimized = [startPoint];

        let current = startPoint;
        while (unvisited.length > 0) {
            let nearestIndex = 0;
            let nearestDistance = Infinity;

            unvisited.forEach((waypoint, index) => {
                const distance = Math.sqrt(
                    (waypoint.x - current.x) ** 2 + (waypoint.y - current.y) ** 2
                );
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });

            current = unvisited[nearestIndex];
            optimized.push(current);
            unvisited.splice(nearestIndex, 1);
        }

        this.mission.waypoints = optimized;
        this.updateWaypointDisplay();
    }

    resetView() {
        console.log('View reset');
        // Implement view reset logic if needed (e.g., zoom/pan)
    }

    centerOnRover() {
        console.log('Centered on rover');
        // Implement centering logic if canvas supports pan/zoom
    }

    // UI Update Methods
    updateMissionControls() {
        const startBtn = document.getElementById('startMissionBtn');
        const pauseBtn = document.getElementById('pauseMissionBtn');
        const stopBtn = document.getElementById('stopMissionBtn');

        if (this.mission.isActive) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;

            startBtn.innerHTML = '<div class="btn-content"><span class="btn-icon">✓</span><div class="btn-text"><span class="btn-title">MISSION ACTIVE</span><span class="btn-subtitle">Rover is operational</span></div></div>';
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;

            startBtn.innerHTML = '<div class="btn-content"><span class="btn-icon">▶</span><div class="btn-text"><span class="btn-title">START MISSION</span><span class="btn-subtitle">Begin autonomous navigation</span></div></div>';
            pauseBtn.innerHTML = '<span class="btn-icon">⏸</span>PAUSE';
        }
    }

    updateMissionStatus() {
        // Mission status
        let statusText = 'READY';
        let statusClass = 'status--info';

        if (this.mission.isActive) {
            statusText = this.mission.isPaused ? 'PAUSED' : 'ACTIVE';
            statusClass = this.mission.isPaused ? 'status--warning' : 'status--success';
        }

        const missionStatusEl = document.getElementById('missionStatus');
        if (missionStatusEl) {
            missionStatusEl.textContent = statusText;
            missionStatusEl.className = `status ${statusClass}`;
        }

        // Progress
        const waypointProgressEl = document.getElementById('waypointProgress');
        if (waypointProgressEl) {
            waypointProgressEl.textContent = `${this.mission.completedTasks} of ${this.mission.waypoints.length}`;
        }

        // Current task
        const currentTaskEl = document.getElementById('currentTask');
        if (currentTaskEl) {
            if (this.rover.currentWaypoint < this.mission.waypoints.length) {
                const currentWaypoint = this.mission.waypoints[this.rover.currentWaypoint];
                currentTaskEl.textContent = currentWaypoint.task;
            } else {
                currentTaskEl.textContent = 'Mission Complete';
            }
        }

        // ETA calculation
        const missionETAEl = document.getElementById('missionETA');
        if (missionETAEl) {
            if (this.mission.isActive && this.rover.speed > 0) {
                const remainingWaypoints = this.mission.waypoints.slice(this.rover.currentWaypoint);
                let remainingDistance = 0;
                let lastPoint = { x: this.rover.x, y: this.rover.y };

                remainingWaypoints.forEach(wp => {
                    remainingDistance += Math.sqrt(
                        (wp.x - lastPoint.x) ** 2 + (wp.y - lastPoint.y) ** 2
                    );
                    lastPoint = wp;
                });

                const etaSeconds = remainingDistance / Math.max(this.rover.speed, 0.1);
                const hours = Math.floor(etaSeconds / 3600);
                const minutes = Math.floor((etaSeconds % 3600) / 60);
                const seconds = Math.floor(etaSeconds % 60);

                missionETAEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                missionETAEl.textContent = '--:--:--';
            }
        }

        // Efficiency
        const missionEfficiencyEl = document.getElementById('missionEfficiency');
        if (missionEfficiencyEl) {
            missionEfficiencyEl.textContent = `${this.mission.efficiency}%`;
        }

        // System health
        const systemHealthEl = document.getElementById('systemHealth');
        if (systemHealthEl) {
            const avgHealth = (this.systemHealth.cpu + this.systemHealth.memory + this.systemHealth.communication) / 3;
            let healthStatus = 'OPTIMAL';
            let healthClass = 'status--success';

            if (avgHealth < 70) {
                healthStatus = 'DEGRADED';
                healthClass = 'status--warning';
            }
            if (avgHealth < 50) {
                healthStatus = 'CRITICAL';
                healthClass = 'status--error';
            }

            systemHealthEl.textContent = healthStatus;
            systemHealthEl.className = `status ${healthClass}`;
        }

        // Update telemetry displays with REAL-TIME DATA
        this.updateElementText('roverPosition', `${Math.round(this.rover.x)}, ${Math.round(this.rover.y)}`);
        this.updateElementText('roverSpeed', `${this.rover.speed.toFixed(2)} m/s`);
        this.updateElementText('roverHeading', `${Math.round((this.rover.heading * 180 / Math.PI + 360) % 360)}°`.padStart(4, '0'));
        this.updateElementText('batteryLevel', `${Math.round(this.rover.battery)}%`);
        this.updateElementText('powerConsumption', `${Math.round(this.rover.powerConsumption)}W`);
        this.updateElementText('totalDistance', `${Math.round(this.mission.totalDistance)}m`);

        // Update progress bar
        const progressPercent = (this.mission.completedTasks / Math.max(1, this.mission.waypoints.length)) * 100;
        const progressFillEl = document.getElementById('progressFill');
        if (progressFillEl) {
            progressFillEl.style.width = `${progressPercent}%`;
        }
        this.updateElementText('progressPercent', `${Math.round(progressPercent)}%`);
    }

    updateRealtimeStatus() {
        const realtimeStatusEl = document.getElementById('realtimeStatus');
        if (realtimeStatusEl) {
            realtimeStatusEl.textContent = this.mission.realtimeStatus;
        }
    }

    updateElementText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = text;
        }
    }

    updateWaypointDisplay() {
        const waypointList = document.getElementById('waypointList');
        if (!waypointList) return;
        waypointList.innerHTML = '';

        this.mission.waypoints.forEach((waypoint, index) => {
            const item = document.createElement('div');
            const isActive = index === this.rover.currentWaypoint && this.mission.isActive;
            const isCompleted = waypoint.completed;

            item.className = `waypoint-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;

            const statusIcon = isCompleted ? '✅' : isActive ? '🎯' : '⭕';

            item.innerHTML = `
                <span class="waypoint-number">#${index + 1}</span>
                <span class="waypoint-task">${waypoint.task}</span>
                <span class="waypoint-coords">${Math.round(waypoint.x)},${Math.round(waypoint.y)}</span>
                <span class="waypoint-status">${statusIcon}</span>
            `;

            waypointList.appendChild(item);
        });
    }

    // Chart and Telemetry Systems
    updateChart(chartType) {
        if (!this.chart || !this.telemetryData[chartType]) return;

        const data = this.telemetryData[chartType];
        this.chart.data.labels = [...data.labels];
        this.chart.data.datasets = data.datasets.map(dataset => ({ ...dataset }));
        this.chart.update('none');
    }

    updateTelemetryData() {
        const timestamp = new Date().toLocaleTimeString();
        const maxDataPoints = 15;

        // Update all telemetry datasets
        Object.keys(this.telemetryData).forEach(chartType => {
            const data = this.telemetryData[chartType];

            // Remove old data points
            if (data.labels.length >= maxDataPoints) {
                data.labels.shift();
                data.datasets.forEach(dataset => dataset.data.shift());
            }

            // Add new timestamp
            data.labels.push(timestamp);
        });

        // Mission progress data
        this.telemetryData.mission_progress.datasets[0].data.push(Math.round(this.mission.totalDistance));
        this.telemetryData.mission_progress.datasets[1].data.push(Math.round(this.rover.speed * 10) / 10);

        // System health data
        this.telemetryData.system_health.datasets[0].data.push(Math.round(this.systemHealth.cpu));
        this.telemetryData.system_health.datasets[1].data.push(Math.round(this.systemHealth.memory));
        this.telemetryData.system_health.datasets[2].data.push(Math.round(this.systemHealth.temperature)); // No offset needed

        // Power consumption data
        this.telemetryData.power_consumption.datasets[0].data.push(Math.round(this.rover.powerConsumption));
        this.telemetryData.power_consumption.datasets[1].data.push(Math.round(this.rover.battery));

        // Environmental data
        this.telemetryData.environmental.datasets[0].data.push(Math.round(this.environment.temperature));
        this.telemetryData.environmental.datasets[1].data.push(Math.round(this.environment.solarIrradiance / 10));

        // Update current chart
        const chartTypeSelect = document.getElementById('chartTypeSelect');
        if (chartTypeSelect) {
            const currentChartType = chartTypeSelect.value;
            this.updateChart(currentChartType);
        }
    }

    startTelemetryUpdates() {
        setInterval(() => this.updateTelemetryData(), 1000); // Update every second
    }

    startSystemHealthMonitoring() {
        setInterval(() => {
            // Simulate realistic system variations
            this.systemHealth.cpu += (Math.random() - 0.5) * 5;
            this.systemHealth.cpu = Math.max(15, Math.min(95, this.systemHealth.cpu));

            this.systemHealth.memory += (Math.random() - 0.5) * 3;
            this.systemHealth.memory = Math.max(25, Math.min(85, this.systemHealth.memory));

            this.systemHealth.temperature += (Math.random() - 0.5) * 2;
            this.systemHealth.temperature = Math.max(25, Math.min(45, this.systemHealth.temperature));

            this.systemHealth.communication += (Math.random() - 0.4) * 4;
            this.systemHealth.communication = Math.max(75, Math.min(100, this.systemHealth.communication));

            // Update health bar displays
            this.updateBar('cpuBar', 'cpuValue', this.systemHealth.cpu, '%');
            this.updateBar('memoryBar', 'memoryValue', this.systemHealth.memory, '%');
            this.updateBar('tempBar', 'tempValue', ((this.systemHealth.temperature - 25) / 20) * 100, '°C', this.systemHealth.temperature);
            this.updateBar('commBar', 'commValue', this.systemHealth.communication, '%');
        }, 2000); // Update every 2 seconds
    }

    updateBar(barId, valueId, value, unit, displayValue = value) {
        const barEl = document.getElementById(barId);
        const valueEl = document.getElementById(valueId);
        if (barEl) barEl.style.width = `${Math.max(0, value)}%`;
        if (valueEl) valueEl.textContent = `${Math.round(displayValue)}${unit}`;
    }

    // Main Game Loop - GUARANTEED 60FPS TARGET
    startGameLoop() {
        let lastTime = performance.now();

        const gameLoop = (currentTime) => {
            const deltaTime = Math.min((currentTime - lastTime) / 1000, 1/30); // Cap delta to prevent large jumps
            lastTime = currentTime;

            // CRITICAL: Update rover movement first
            this.updateRoverMovement(deltaTime);

            // Update mission timer
            if (this.mission.isActive && this.mission.startTime) {
                const elapsed = (Date.now() - this.mission.startTime) / 1000;
                const hours = Math.floor(elapsed / 3600);
                const minutes = Math.floor((elapsed % 3600) / 60);
                const seconds = Math.floor(elapsed % 60);

                this.updateElementText('globalTimer', `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }

            // Update UI frequently for real-time feel
            this.updateMissionStatus();

            // Render canvas
            this.drawCanvas();

            // Schedule next frame
            this.animationId = requestAnimationFrame(gameLoop);
        };

        console.log('Starting game loop...');
        this.animationId = requestAnimationFrame(gameLoop);
    }

    // Modal and Alert Systems
    showAlert(message) {
        this.updateElementText('emergencyMessage', message);
        this.showModal('emergencyModal');
    }

    showMissionComplete() {
        this.updateElementText('completedWaypoints', this.mission.waypoints.length);
        this.updateElementText('completedDistance', `${Math.round(this.mission.totalDistance)}m`);

        const missionTime = (Date.now() - this.mission.startTime) / 1000;
        const hours = Math.floor(missionTime / 3600);
        const minutes = Math.floor((missionTime % 3600) / 60);
        const seconds = Math.floor(missionTime % 60);

        this.updateElementText('completedTime', `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        this.updateElementText('completedEfficiency', `${this.mission.efficiency}%`);

        this.showModal('successModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }, 500);
    }
}

// Initialize the Autonomous Navigation System
let autonomousNavigationSystem;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Autonomous Navigation System...');
    autonomousNavigationSystem = new AutonomousNavigationSystem();
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Autonomous Navigation System Error:', event.error);
    if (autonomousNavigationSystem) {
        autonomousNavigationSystem.showAlert('System error detected. Please restart the mission if issues persist.');
    }
});

// Prevent page unload during active mission
window.addEventListener('beforeunload', (event) => {
    if (autonomousNavigationSystem && autonomousNavigationSystem.mission.isActive) {
        event.preventDefault();
        return 'Mission is currently active. Are you sure you want to leave?';
    }
});