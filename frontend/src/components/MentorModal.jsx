import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Users, Send, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MentorModal = ({ isOpen, onClose, careerTitle, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/request-mentor`, {
        career_title: careerTitle,
        user_name: formData.name,
        user_email: formData.email,
        message: formData.message
      });

      toast({
        title: "Mentor Request Sent!",
        description: "We'll connect you with a suitable mentor within 24-48 hours.",
      });

      setFormData({ name: user?.name || '', email: user?.email || '', message: '' });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send mentor request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800">Find a Mentor</div>
              <div className="text-sm text-slate-600">{careerTitle}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium text-slate-700">
              Why do you want a mentor in this field?
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your goals and what you'd like to learn from a mentor..."
              rows={4}
              required
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>What happens next?</strong><br />
            Our team will match you with an experienced professional in {careerTitle} who can provide guidance, answer questions, and share their career journey.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorModal;