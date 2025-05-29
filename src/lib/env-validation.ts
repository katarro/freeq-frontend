const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL_DEVELOP',
  'NEXT_PUBLIC_API_URL_PRODUCTION',
  'NEXT_PUBLIC_MODE',
];

function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missing.forEach((envVar) => console.error(`  - ${envVar}`));
    console.error('\n📝 Agrega estas variables a tu archivo .env.local');
    process.exit(1);
  }

  console.log('✅ Todas las variables de entorno están configuradas');
}

validateEnv();
