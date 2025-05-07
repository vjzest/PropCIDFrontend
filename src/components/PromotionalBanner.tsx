
import { Button } from '@/components/ui/button';

const PromotionalBanner = () => {
  return (
    <section className="mb-12 relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-300 opacity-90 z-0"></div>
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }}
      ></div>
      
      <div className="relative z-10 p-8 md:p-12 text-white">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Your Dream Property Today</h2>
          <p className="mb-6 text-white/90">
            Join thousands of satisfied customers who found their perfect home through PropCID. 
            Our advanced property matching system helps you find exactly what you're looking for.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-primary hover:bg-neutral-100">Get Started</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
