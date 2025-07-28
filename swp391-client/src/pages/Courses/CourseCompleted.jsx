import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Award } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

// Firework effect (simple canvas)
const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Firework particle
    function Particle(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 2 + 1;
      this.color = color;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = Math.random() * 5 + 2;
      this.alpha = 1;
      this.update = function () {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.015;
      };
      this.draw = function (ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      };
    }

    let particles = [];
    function launchFirework() {
      const colors = ['#ff1744', '#ff9100', '#ffd600', '#00e676', '#2979ff', '#d500f9'];
      const x = Math.random() * W * 0.8 + W * 0.1;
      const y = Math.random() * H * 0.3 + H * 0.1;
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    }

    let fireworkInterval = setInterval(launchFirework, 900);

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      clearInterval(fireworkInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

const CourseCompleted = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Fireworks />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border border-red-200 p-10 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-full p-4 mb-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-red-700 mb-2">Congratulations!</h1>
            <p className="text-lg text-gray-700 mb-4">You have successfully completed this course!</p>
            <Award className="w-12 h-12 text-yellow-400 mb-2" />
            <p className="text-gray-600 mb-6">Keep learning and growing. Your achievement has been recorded.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Back to Course List
            </button>
            <button
              onClick={() => {
                const course_id = localStorage.getItem('course_id');
                if (!course_id || course_id === 'null' || course_id === '') {
                  alert('Course ID not found. Please try again or contact the administrator.');
                  return;
                }
                navigate(`/learning/${course_id}`, { state: { showHistory: true } });
              }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-yellow-300"
            >
              Detail History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCompleted; 