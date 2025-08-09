import React from 'react';
import { MapPin, Clock, Phone, Mail, Calendar, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from '../hooks/useLanguage';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { translations } = useLanguage();

  return (
    <div className="space-y-8 sm:space-y-12">
     
      {/* Contact Information */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl mx-2 sm:mx-4 lg:mx-0 p-6 sm:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {translations.getInTouch}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {translations.contactUs}
                  </p>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 golden-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{translations.callUsForBooking}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{translations.phoneReservation}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 golden-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{translations.address}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{translations.khujand}</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 golden-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{translations.workingHours}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {translations.callUsForBooking}
                </h3>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.open('tel:+992882027777')}
                  className="w-full golden-gradient text-black hover:golden-gradient-hover py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg"
                >
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {translations.callUsNow}
                </Button>

                <Button
                  onClick={() => onNavigate?.('reservations')}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {translations.makeReservation}
                </Button>

                <Button
                  onClick={() => window.open('https://wa.me/992882027777', '_blank')}
                  variant="outline"
                  className="w-full border-green-300 text-green-800 hover:bg-green-50 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl mx-2 sm:mx-4 lg:mx-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-2">{translations.howToFindUs}</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.129379393669!2d69.63634087587128!3d40.29508617145932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b1b37f6a772329%3A0x7dbf31a61903c82a!2z0KDQtdGB0YLQvtGA0LDQvSDQpNC-0YDQtdC70Yw!5e0!3m2!1sru!2s!4v1754103234360!5m2!1sru!2s" 
              width="100%" 
              height="300" 
              style={{border:0}} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 sm:h-80 lg:h-96"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}