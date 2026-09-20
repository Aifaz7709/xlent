import React, { useEffect } from 'react';
import { ArrowRight, CarFront, Sparkles, UserRound, X } from 'lucide-react';
import './ServiceChoiceModal.css';

const SERVICE_KEY = 'xlent_service_type';

export const getStoredServiceType = () => sessionStorage.getItem(SERVICE_KEY);

const ServiceChoiceModal = ({ onSelect, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.classList.add('service-choice-open');
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('service-choice-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const chooseService = (serviceType) => {
    sessionStorage.setItem(SERVICE_KEY, serviceType);
    window.dispatchEvent(new CustomEvent('xlent-service-selected', {
      detail: { serviceType }
    }));
    onSelect(serviceType);
  };

  return (
    <div className="service-choice-backdrop" role="presentation" onClick={onClose}>
      <section
        className="service-choice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-choice-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="service-choice-glow service-choice-glow-one" />
        <div className="service-choice-glow service-choice-glow-two" />

        <button className="service-choice-close" type="button" onClick={onClose} aria-label="Close service selection">
          <X size={19} />
        </button>

        <div className="service-choice-kicker"><Sparkles size={15} /> Your ride, your way</div>
        <h2 id="service-choice-title">How would you like to travel?</h2>
        <p className="service-choice-intro">Choose your preferred experience and we&apos;ll tailor your XLent journey around it.</p>

        <div className="service-choice-options">
          <button className="service-choice-card" type="button" onClick={() => chooseService('with_driver')}>
            <span className="service-choice-icon"><UserRound size={25} /></span>
            <span className="service-choice-copy">
              <strong>With a driver</strong>
              <small>Relax while a professional handles the road.</small>
            </span>
            <ArrowRight className="service-choice-arrow" size={20} />
          </button>

          <button className="service-choice-card" type="button" onClick={() => chooseService('self_drive')}>
            <span className="service-choice-icon"><CarFront size={25} /></span>
            <span className="service-choice-copy">
              <strong>Self-drive</strong>
              <small>Take the wheel and make the trip completely yours.</small>
            </span>
            <ArrowRight className="service-choice-arrow" size={20} />
          </button>
        </div>

        <p className="service-choice-note">You can change this preference on your next visit.</p>
      </section>
    </div>
  );
};

export default ServiceChoiceModal;
