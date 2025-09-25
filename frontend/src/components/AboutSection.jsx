import React from 'react';
import { Card, CardContent } from './ui/card';
import { Target, Users, BookOpen, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            About Questly
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering South African students to discover their career potential through AI-powered guidance tailored for our unique educational landscape.
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="mb-12 bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <Target className="w-8 h-8 text-emerald-600 mr-3" />
              The Problem We Solve
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              Every year, thousands of South African matric students struggle to choose the right career path. They face:
            </p>
            <ul className="text-slate-700 space-y-2 ml-6">
              <li>• <strong>Limited career guidance</strong> in under-resourced schools</li>
              <li>• <strong>Confusion about APS requirements</strong> and university admission processes</li>
              <li>• <strong>Lack of awareness</strong> about emerging careers and local opportunities</li>
              <li>• <strong>Disconnect between subjects chosen</strong> and future career goals</li>
              <li>• <strong>No clear pathway</strong> from Grade 10 subject choices to meaningful careers</li>
            </ul>
            <p className="text-lg text-slate-700 leading-relaxed mt-4">
              <strong>Questly bridges this gap</strong> by providing personalized, AI-powered career guidance that considers South African qualifications, local institutions, and the unique opportunities available across Africa.
            </p>
          </CardContent>
        </Card>

        {/* Our Solution */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Smart Subject Guidance</h4>
              <p className="text-slate-600">
                Get recommendations for Grade 10-12 subjects that align with your dream careers and APS requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Local Institution Matching</h4>
              <p className="text-slate-600">
                Discover universities, TVET colleges, and private institutions across South Africa that offer your chosen path.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">African Success Stories</h4>
              <p className="text-slate-600">
                Meet inspiring professionals from across Africa who share their journey and provide mentorship insights.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Practical Next Steps</h4>
              <p className="text-slate-600">
                Get actionable weekend projects and course recommendations to start building skills immediately.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-700 max-w-4xl mx-auto">
            <strong>Our mission:</strong> To democratize career guidance across Africa, ensuring every student has access to personalized, 
            culturally relevant career insights that honor their potential and connect them to meaningful opportunities in our rapidly evolving economy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;