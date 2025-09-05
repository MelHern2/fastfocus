<template>
  <div class="about">
    <div class="about-content">
      <h1 class="about-title">
        <span class="about-text-part">Acerca de</span>
        <img src="/src/assets/logo-fast-focus-removebg-preview.png" alt="FastFocus" class="about-logo" />
      </h1>
      
      <div class="about-text">
        <p>
          En un mundo en constante transformación, creemos que comprender la dinámica social y política es esencial para interpretar el presente y anticipar el futuro. Nuestro espacio nace con la vocación de ofrecer un análisis riguroso, crítico y accesible sobre los fenómenos que moldean nuestras sociedades: desde los cambios en la opinión pública y las dinámicas de poder, hasta los movimientos sociales y las transformaciones culturales.
        </p>
        
        <p>
          No nos limitamos a describir la realidad: buscamos desentrañar sus causas, poner en perspectiva sus efectos y abrir el debate a nuevas miradas. Combinamos herramientas de investigación, reflexión teórica y datos empíricos para construir un análisis integral que dialogue tanto con la academia como con la ciudadanía.
        </p>
        
        <p>
          Nuestra misión es aportar claridad en medio de la complejidad, fomentar la discusión informada y contribuir a una comprensión más profunda de los procesos sociopolíticos que marcan nuestro tiempo.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 1rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

.about-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  border-radius: 20px 20px 0 0;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 80px;
}

.about-text-part {
  background: linear-gradient(135deg, #1f2937 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-logo {
  height: 65px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.2));
  vertical-align: middle;
  margin-top: -5px;
}

.about-text {
  color: #374151;
  line-height: 1.7;
  font-size: 1.125rem;
}

.about-text p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.about-text p:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (min-width: 1400px) {
  .about-content {
    max-width: 900px;
    padding: 4rem 3rem;
  }
  
  .about-title {
    font-size: 3rem;
    height: 100px;
  }
  
  .about-logo {
    height: 85px;
    margin-top: -8px;
  }
  
  .about-text {
    font-size: 1.25rem;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .about-content {
    max-width: 850px;
    padding: 3.5rem 2.5rem;
  }
  
  .about-title {
    font-size: 2.75rem;
    height: 90px;
  }
  
  .about-logo {
    height: 75px;
    margin-top: -6px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .about-content {
    max-width: 800px;
    padding: 3rem 2rem;
  }
  
  .about-title {
    font-size: 2.5rem;
    height: 80px;
  }
  
  .about-logo {
    height: 65px;
    margin-top: -5px;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
  
  .about-content {
    padding: 2rem 1.5rem;
    margin: 0 0.5rem;
  }
  
  .about-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    height: auto;
  }
  
  .about-logo {
    height: 50px;
    margin-top: 0;
  }
  
  .about-text {
    font-size: 1rem;
  }
  
  .about-text p {
    margin-bottom: 1rem;
  }
}
</style>
