
const BASE_URL = 'http://localhost:3000'; // Adjust port if necessary

async function verifyAuth() {
    console.log('Starting authentication verification...');

    // 1. Try PATCH without token
    try {
        const response = await fetch(`${BASE_URL}/product/123`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test' })
        });
        if (response.status === 401) {
            console.log('✅ PASS: PATCH /product/:id returned 401 without token');
        } else {
            console.error(`❌ FAIL: PATCH /product/:id returned ${response.status} instead of 401`);
        }
    } catch (error) {
        console.error(`❌ FAIL: PATCH /product/:id failed with error: ${error.message}`);
    }

    // 2. Try DELETE without token
    try {
        const response = await fetch(`${BASE_URL}/product/123`, { method: 'DELETE' });
        if (response.status === 401) {
            console.log('✅ PASS: DELETE /product/:id returned 401 without token');
        } else {
            console.error(`❌ FAIL: DELETE /product/:id returned ${response.status} instead of 401`);
        }
    } catch (error) {
        console.error(`❌ FAIL: DELETE /product/:id failed with error: ${error.message}`);
    }

    // 3. Login to get token
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    let token = '';

    try {
        console.log(`Registering temporary user ${email}...`);
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name: 'Test User' })
        });

        console.log('Logging in...');
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginResponse.json();
        token = loginData.token;

        if (token) {
            console.log('✅ Got token');
        } else {
            console.error('⚠️ Could not get token. Response:', loginData);
            return;
        }

    } catch (error) {
        console.error('⚠️ Could not register/login. Is the server running? Is the DB connected?', error.message);
        return;
    }

    // 4. Try PATCH with token
    try {
        const response = await fetch(`${BASE_URL}/product/999999`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: 'Updated Name' })
        });

        if (response.status === 401) {
            console.error('❌ FAIL: PATCH /product/:id returned 401 WITH token');
        } else {
            console.log(`✅ PASS: PATCH /product/:id authenticated successfully (Response: ${response.status})`);
        }
    } catch (error) {
        console.error(`❌ FAIL: PATCH /product/:id error: ${error.message}`);
    }

    // 5. Try DELETE with token
    try {
        const response = await fetch(`${BASE_URL}/product/999999`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.error('❌ FAIL: DELETE /product/:id returned 401 WITH token');
        } else {
            console.log(`✅ PASS: DELETE /product/:id authenticated successfully (Response: ${response.status})`);
        }
    } catch (error) {
        console.error(`❌ FAIL: DELETE /product/:id error: ${error.message}`);
    }
}

verifyAuth();
