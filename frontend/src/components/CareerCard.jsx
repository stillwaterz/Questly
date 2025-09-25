import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, DollarSign, User, Calendar, Target, AlertCircle } from 'lucide-react';

const CareerCard = ({ career, index }) => {
  const cardColors = [
    'from-emerald-50 to-teal-50 border-emerald-200',
    'from-sky-50 to-blue-50 border-sky-200',
    'from-yellow-50 to-amber-50 border-yellow-200'
  ];

  const iconColors = [
    'text-emerald-600',
    'text-sky-600', 
    'text-yellow-600'
  ];

  const badgeColors = [
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-yellow-100 text-yellow-700'
  ];

  return (
    <Card className={`w-full max-w-4xl mx-auto bg-gradient-to-br ${cardColors[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-slate-800">
            {career.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`${badgeColors[index % 3]} font-medium`}>
              <Clock className="w-3 h-3 mr-1" />
              {career.timeToMastery}
            </Badge>
            <Badge className={`${badgeColors[index % 3]} font-medium`}>
              <DollarSign className="w-3 h-3 mr-1" />
              {career.averageSalary}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Persona Section */}
        <div className="bg-white/60 rounded-xl p-6 border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white shadow-md`}>
              <User className={`w-5 h-5 ${iconColors[index % 3]}`} />
            </div>
            <h4 className="text-xl font-semibold text-slate-800">{career.persona.title}</h4>
          </div>
          <p className="text-slate-700 leading-relaxed">{career.persona.description}</p>
        </div>

        {/* Day in Life Section */}
        <div className="bg-white/60 rounded-xl p-6 border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white shadow-md`}>
              <Calendar className={`w-5 h-5 ${iconColors[index % 3]}`} />
            </div>
            <h4 className="text-xl font-semibold text-slate-800">{career.dayInLife.title}</h4>
          </div>
          <p className="text-slate-700 leading-relaxed">{career.dayInLife.description}</p>
        </div>

        {/* Weekend Quest Section */}
        <div className="bg-white/60 rounded-xl p-6 border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white shadow-md`}>
              <Target className={`w-5 h-5 ${iconColors[index % 3]}`} />
            </div>
            <h4 className="text-xl font-semibold text-slate-800">{career.weekendQuest.title}</h4>
          </div>
          <p className="text-slate-700 leading-relaxed">{career.weekendQuest.description}</p>
        </div>

        {/* Reality Check Section */}
        <div className="bg-white/60 rounded-xl p-6 border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white shadow-md`}>
              <AlertCircle className={`w-5 h-5 ${iconColors[index % 3]}`} />
            </div>
            <h4 className="text-xl font-semibold text-slate-800">{career.realityCheck.title}</h4>
          </div>
          <p className="text-slate-700 leading-relaxed">{career.realityCheck.description}</p>
        </div>

        {/* Skills Section */}
        <div className="bg-white/60 rounded-xl p-6 border border-white/40">
          <h4 className="text-lg font-semibold text-slate-800 mb-3">Key Skills You'll Need</h4>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill, skillIndex) => (
              <Badge 
                key={skillIndex} 
                variant="secondary"
                className="bg-white/80 text-slate-700 hover:bg-white transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerCard;