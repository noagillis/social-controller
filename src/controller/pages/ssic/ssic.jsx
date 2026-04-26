import PropTypes from "prop-types";
import DpadHighlight from "./assets/dpad-highlight.svg?react";
import DpadShadow from "./assets/dpad-shadow.svg?react";
import ScreenWrapper from "../../common/screen-wrapper";
import { SSICAction, SSICDpad /* , SSICVoiceChat */ } from "./ssic-components";
import "./ssic.scss";

export default function SSIC({ children, ...props }) {
  return (
    <ScreenWrapper>
      <div className="ssic flex-row-center">
        <div className="ssic-layout">
          <div className="action-area -left">
            <div className="ssic-dpad">
              {/* Shared gradient definition for quadrant fills */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="dpadGrad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5553FF" stopOpacity="0" />
                    <stop offset="1" stopColor="#76C6FF" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
              </svg>
              <DpadHighlight className="dpad-highlight" />
              <DpadShadow className="dpad-shadow" />
              <SSICDpad action="Up" />
              <SSICDpad action="Left" />
              <SSICDpad action="Right" />
              <SSICDpad action="Down" />
            </div>
          </div>

          <div className="action-area -right">
            <div className="ssic-actions">
              <SSICAction action={"A"} {...props} />
              <SSICAction action={"B"} />
              <SSICAction action={"Y"} />
              <SSICAction action={"X"} />
            </div>
          </div>
        </div>
      </div>
      {children}
    </ScreenWrapper>
  );
}

SSIC.propTypes = {
  children: PropTypes.node,
  isInGame: PropTypes.bool,
};
