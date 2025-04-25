export default function GlobalNotFound() {
  return (
    <div className="not-found-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');
        
        .not-found-page {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.05));
          color: #333;
          min-height: 100vh;
          width: 100%;
        }
        
        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        
        .not-found-image-container {
          position: relative;
          width: 400px;
          height: 400px;
          margin-bottom: 1rem;
        }
        
        .not-found-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .not-found-title {
          font-size: 6rem;
          margin: 0 0 2rem;
          font-weight: bold;
          font-family: 'Alfa Slab One', cursive;
          text-align: center;
        }
        
        .not-found-button {
          padding: 16px 32px;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          color: white;
          text-decoration: none;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 1.125rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .not-found-button:hover {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: translateY(-5px) scale(1.05);
        }
        
        .not-found-button-icon {
          margin-left: 8px;
          width: 20px;
          height: 20px;
          display: inline-block;
        }
      ` }} />
      <div className="not-found-container">
        <div className="not-found-image-container">
          <img
            src="/static/maestrito/maestrito_sad_transparent.webp"
            alt="Maestrito Sad"
            className="not-found-image"
          />
        </div>

        <h1 className="not-found-title">
          404
        </h1>

        <a 
          href="/" 
          className="not-found-button"
        >
          ← Home
        </a>
      </div>
    </div>
  );
}