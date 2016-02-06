import Ember from 'ember';

export default Ember.Controller.extend({
  dataUrl: 'https://raw.githubusercontent.com/triketora/women-in-software-eng/master/data.txt',

  fetchLatestData: function () {
    return Ember.$.get(this.get('dataUrl'));
  },

  convertToObject: function (rawData) {
    // strip comments
    let stripped = rawData.replace(/^#.*$/gm,'');

    // split on [headers]
    let groups = stripped.split(/\[\w+\]/g);

    // iterate over companies
    groups = groups.map((group) => {
      // separate key/value pairs
      return group.match(/\s*(.+):\s+(.+)\n/mg);
    }).splice(1);

    // let result = {};

    return groups.map((attributes) => {
      let entry = {};

      attributes.forEach((attr) => {
        // separate attribute/value from string
        let parts = attr.split(':');

        // store as key/value in object
        entry[parts[0].trim()] = parts[1].trim();
      });

      return entry;
    });

    // return result;
  },

  updateTheData: Ember.on('init', function() {
    // asynchronously update the data set
    this
      .fetchLatestData()
      .then(this.convertToObject)
      .then((arr) => {
        arr.forEach((obj) => {
          obj.percent_female_eng = (100 * obj.num_female_eng / obj.num_eng).toFixed(2);
        });

        return arr;
      })
      .then((jsonified) => { this.set('unsortedData', jsonified); });

  }),

  dataSorting: ['company'],
  sortedData: Ember.computed.sort('unsortedData', 'dataSorting'),
  stringifiedSortedData: Ember.computed('sortedData', function (){
    return JSON.stringify(this.get('sortedData'));
  })
});
