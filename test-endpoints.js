// Script de pruebas manuales para verificar endpoints
// Ejecutar con: node test-endpoints.js

const baseURL = 'http://localhost:8080';

async function testEndpoint(method, endpoint, body = null) {
    const url = `${baseURL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        console.log(`\n🔍 Testing ${method} ${endpoint}`);
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error(`❌ Error testing ${endpoint}:`, error.message);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Iniciando pruebas de endpoints...\n');
    
    // Test 1: Info de la API
    await testEndpoint('GET', '/');
    
    // Test 2: Generar mascotas mock
    await testEndpoint('GET', '/api/mocks/mockingpets?count=5');
    
    // Test 3: Generar usuarios mock  
    await testEndpoint('GET', '/api/mocks/mockingusers?count=3');
    
    // Test 4: Generar e insertar datos
    await testEndpoint('POST', '/api/mocks/generateData', {
        users: 2,
        pets: 3
    });
    
    // Test 5: Verificar usuarios insertados
    await testEndpoint('GET', '/api/users');
    
    // Test 6: Verificar mascotas insertadas
    await testEndpoint('GET', '/api/pets');
    
    console.log('\n✅ Pruebas completadas!');
}

// Verificar si Node.js tiene fetch (v18+) o usar node-fetch
if (typeof fetch === 'undefined') {
    console.log('❌ Este script requiere Node.js v18+ con fetch global');
    console.log('💡 Alternativamente, instala node-fetch: npm install node-fetch');
    console.log('💡 O usa las pruebas con curl desde el README.md');
    process.exit(1);
}

runTests().catch(console.error);