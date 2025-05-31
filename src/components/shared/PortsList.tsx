
import React from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PortsListProps {
  ports: any;
  maxDisplay?: number;
  className?: string;
}

const PortsList = ({ ports, maxDisplay = 4, className = "" }: PortsListProps) => {
  const formatPorts = (ports: any) => {
    if (!ports) return [];
    
    if (typeof ports === 'string') {
      return ports.split(',').map(p => p.trim()).filter(Boolean);
    }
    
    if (Array.isArray(ports)) {
      const validPorts = ports.filter(port => {
        if (typeof port === 'string') return port;
        if (typeof port === 'object' && port !== null) {
          return port.name || port.port || port.location;
        }
        return false;
      });
      
      const portNames = validPorts.map(port => {
        if (typeof port === 'string') return port;
        return port.name || port.port || port.location || 'Unknown Port';
      });
      
      return portNames;
    }
    
    if (typeof ports === 'object' && ports !== null) {
      return [ports.name || ports.port || ports.location || 'Port details available'];
    }
    
    return ['Port information available'];
  };

  const portList = formatPorts(ports);
  const displayedPorts = portList.slice(0, maxDisplay);
  const hasMorePorts = portList.length > maxDisplay;

  return (
    <div className={`text-sm text-charcoal ${className}`}>
      <span className="font-medium text-charcoal">Ports: </span>
      <span>{displayedPorts.join(' • ')}</span>
      {hasMorePorts && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-2 text-ocean-blue hover:text-deep-navy text-xs underline inline-flex items-center gap-1">
              <Info className="w-3 h-3" />
              +{portList.length - maxDisplay} more
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-charcoal">All Ports of Call</h4>
              <div className="text-sm text-slate-gray">
                {portList.join(' • ')}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PortsList;
