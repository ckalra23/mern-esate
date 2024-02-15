import React from 'react';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 py-8 mb-10">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">Terms and Conditions</h1>
        <p className="mb-4 text-slate-700">
          Please read these terms and conditions carefully before using our website.
        </p>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-800">1. Introduction</h2>
        <p className="mb-4 text-slate-700">
          These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, accessible at www.example.com.
        </p>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-800">2. Intellectual Property Rights</h2>
        <p className="mb-4 text-slate-700">
          Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.
        </p>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-800">3. Restrictions</h2>
        <p className="mb-4 text-slate-700">
          You are specifically restricted from all of the following:
        </p>
          <ul className="list-disc list-inside text-slate-700">
            <li>publishing any Website material in any other media;</li>
            <li>selling, sublicensing, and/or otherwise commercializing any Website material;</li>
            <li>publicly performing and/or showing any Website material;</li>
            <li>using this Website in any way that is or may be damaging to this Website;</li>
            <li>using this Website in any way that impacts user access to this Website;</li>
          </ul>
      </div>
      <Footer />
    </div>
  );
}

export default TermsAndConditions;
