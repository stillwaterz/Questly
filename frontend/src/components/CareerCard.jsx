import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, DollarSign, User, Calendar, Target, AlertCircle, BookOpen, GraduationCap, MapPin, Users, Volume2, VolumeX, Play } from 'lucide-react';
import MentorModal from './MentorModal';

const CareerCard = ({ career, index, user }) => {
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const textToRead = `
          ${career.title}. 
          ${career.persona.description} 
          ${career.dayInLife.description} 
          ${career.weekendQuest.description} 
          ${career.realityCheck.description}
        `;
        
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
    <>
      <Card className={`w-full max-w-4xl mx-auto bg-gradient-to-br ${cardColors[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* Career Image */}
              {career.imageUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-md flex-shrink-0">
                  <img 
                    src={career.imageUrl} 
                    alt={career.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  {career.title}
                </CardTitle>
                <div className="flex gap-2 flex-wrap mb-3">
                  <Badge className={`${badgeColors[index % 3]} font-medium text-xs`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {career.timeToMastery}
                  </Badge>
                  <Badge className={`${badgeColors[index % 3]} font-medium text-xs`}>
                    <DollarSign className="w-3 h-3 mr-1" />
                    {career.averageSalary}
                  </Badge>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleReadAloud}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {isPlaying ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                    {isPlaying ? 'Stop Reading' : 'Read Aloud'}
                  </Button>
                  
                  <Button
                    onClick={() => setShowMentorModal(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Find a Mentor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Video Section */}
          {career.videoUrl && (
            <div className="bg-white/60 rounded-xl p-5 border border-white/40">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-md`}>
                  <Play className={`w-4 h-4 ${iconColors[index % 3]}`} />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">See Yourself in Action</h4>
              </div>
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <Play className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Career Video Coming Soon</p>
                  <p className="text-xs">Generated with Veo 3</p>
                </div>
              </div>
            </div>
          )}

          {/* Persona Section */}
          <div className="bg-white/60 rounded-xl p-5 border border-white/40">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-md`}>
                <User className={`w-4 h-4 ${iconColors[index % 3]}`} />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{career.persona.title}</h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">{career.persona.description}</p>
          </div>

          {/* Day in Life Section */}
          <div className="bg-white/60 rounded-xl p-5 border border-white/40">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-md`}>
                <Calendar className={`w-4 h-4 ${iconColors[index % 3]}`} />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{career.dayInLife.title}</h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">{career.dayInLife.description}</p>
          </div>

          {/* Weekend Quest Section */}
          <div className="bg-white/60 rounded-xl p-5 border border-white/40">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-md`}>
                <Target className={`w-4 h-4 ${iconColors[index % 3]}`} />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{career.weekendQuest.title}</h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">{career.weekendQuest.description}</p>
          </div>

          {/* Reality Check Section */}
          <div className="bg-white/60 rounded-xl p-5 border border-white/40">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-md`}>
                <AlertCircle className={`w-4 h-4 ${iconColors[index % 3]}`} />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{career.realityCheck.title}</h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">{career.realityCheck.description}</p>
          </div>

          {/* South African Specific Information */}
          {career.subjects && (
            <div className="bg-white/60 rounded-xl p-5 border border-white/40">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-md`}>
                  <BookOpen className={`w-4 h-4 ${iconColors[index % 3]}`} />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">High School Subjects to Choose</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">Essential Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {career.subjects.essential?.map((subject, idx) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {career.subjects.recommended && (
                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-2">Recommended Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.subjects.recommended.map((subject, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-orange-800">
                    <strong>APS Required:</strong> {career.subjects.aps_range} points
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Remember: APS = Life Orientation + 6 best subjects (max 600 points)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SA Institutions */}
          {career.institutions && (
            <div className="bg-white/60 rounded-xl p-5 border border-white/40">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-md`}>
                  <GraduationCap className={`w-4 h-4 ${iconColors[index % 3]}`} />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">Where to Study in South Africa</h4>
              </div>
              
              <div className="space-y-3">
                {career.institutions.slice(0, 3).map((inst, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-white/80">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-800 text-sm">{inst.institution}</h5>
                        <p className="text-xs text-slate-600 mb-1">{inst.programme}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span>{inst.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {inst.duration}
                        </Badge>
                        <p className="text-xs text-slate-600 mt-1">
                          APS: {inst.aps_required}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          <div className="bg-white/60 rounded-xl p-5 border border-white/40">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Key Skills You'll Need</h4>
            <div className="flex flex-wrap gap-2">
              {career.skills?.map((skill, skillIndex) => (
                <Badge 
                  key={skillIndex} 
                  variant="secondary"
                  className="bg-white/80 text-slate-700 hover:bg-white transition-colors text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentor Modal */}
      <MentorModal
        isOpen={showMentorModal}
        onClose={() => setShowMentorModal(false)}
        careerTitle={career.title}
        user={user}
      />
    </>
  );
};

export default CareerCard;