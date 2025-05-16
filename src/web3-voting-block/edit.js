import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
  return (
    <div { ...useBlockProps() }>
      <h2>{ __('Web3 Voting System', 'web3-voting-block') }</h2>
      <p style={{ color: '#666' }}>
        {__('The voting feature will appear on the frontend. Please preview the page to see it in action.', 'web3-voting-block')}
      </p>
    </div>
  );
}
