import Ember from 'ember';

export default Ember.Controller.extend({
  fetchLatestData: function () {
    return Ember.$.get('https://raw.githubusercontent.com/triketora/women-in-software-eng/master/data.txt');
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

    let result = {};

    groups.forEach((attributes) => {
      let entry = {};

      attributes.forEach((attr) => {
        // separate attribute/value from string
        let parts = attr.split(':');

        // store as key/value in object
        entry[parts[0].trim()] = parts[1].trim();
      });

      // store attributes in object under company name as key
      result[entry.company] = entry;
      delete entry.company;
    });

    return result;
  },

  theData: Ember.computed(function() {
    let data = Ember.Object.create();

    // asynchronously update the data set
    this
      .fetchLatestData()
      .then(this.convertToObject)
      .then((jsonified) => {
        data.set('foo', JSON.stringify(jsonified));
      });

    return data;
  })
});
