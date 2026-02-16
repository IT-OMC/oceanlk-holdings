const API_BASE = process.argv[2] === 'server' ? 'https://test.ocean.lk/api' : 'http://localhost:8080/api';
const HOST = process.argv[2] === 'server' ? 'test.ocean.lk' : 'localhost';
const PORT = process.argv[2] === 'server' ? 443 : 8080;
const PROTOCOL = process.argv[2] === 'server' ? require('https') : require('http');

const username = process.argv[3] || 'admin';
const password = process.argv[4] || 'admin123';

console.log(`Testing against: ${API_BASE}`);
console.log(`Using credentials: ${username}`);

const ADMIN_CREDENTIALS = { username, password };

function request(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : '';
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 10000 // 10 seconds timeout
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = PROTOCOL.request(options, (res) => {
            let bodyData = '';
            res.on('data', (chunk) => bodyData += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: bodyData ? JSON.parse(bodyData) : null
                    });
                } catch (e) {
                    resolve({ status: res.statusCode, body: bodyData });
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Tests ---');

    // 1. Login
    console.log('Logging in...');
    const loginRes = await request('/api/admin/login', 'POST', ADMIN_CREDENTIALS);
    if (loginRes.status !== 200) {
        console.error('Login failed:', loginRes.status, loginRes.body);
        return;
    }
    const token = loginRes.body.token;
    console.log('Login successful. Token obtained.');

    // 2. Create Job
    console.log('Creating job...');
    const newJob = {
        title: 'Test Job ' + Date.now(),
        company: 'OceanLK Test',
        location: 'Remote',
        type: 'Full-time',
        category: 'Engineering',
        description: 'Testing Job CRUD',
        level: 'Junior',
        featured: true
    };
    const createRes = await request('/api/admin/jobs', 'POST', newJob, token);
    console.log('Create Response:', createRes.status, createRes.body);
    const jobId = createRes.body.id || (createRes.body.pendingChange ? createRes.body.pendingChange.targetId : null);

    if (!jobId && !createRes.body.pendingChange) {
        console.log("Job probably needs approval but ID not returned directly.");
    }

    // 3. Get all jobs
    console.log('Getting all jobs...');
    const getRes = await request('/api/jobs', 'GET');
    console.log('Get Jobs Count:', getRes.body.length);

    // 4. Update Job (if we have an ID)
    if (jobId) {
        console.log(`Updating job ${jobId}...`);
        const updateJob = { ...newJob, title: 'Updated Test Job' };
        const updateRes = await request(`/api/admin/jobs/${jobId}`, 'PUT', updateJob, token);
        console.log('Update Response:', updateRes.status, updateRes.body);

        // 5. Delete Job
        console.log(`Deleting job ${jobId}...`);
        const deleteRes = await request(`/api/admin/jobs/${jobId}`, 'DELETE', null, token);
        console.log('Delete Response:', deleteRes.status, deleteRes.body);
    } else {
        console.log("Skipping Update/Delete as no ID was captured (possibly pending approval).");
    }

    console.log('--- Tests Completed ---');
}

runTests().catch(console.error);
