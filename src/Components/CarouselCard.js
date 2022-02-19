import React, { Component } from 'react';
import { Text, Image, View, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import * as Constants from '../Constants'

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 6);

const DATA = [];
for (let i = 0; i < 4; i++) {
  DATA.push(i);
}

export default class CarouselCard extends Component {
  state = {
    index: 0,
  };


  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem({ item }) {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={{elevation:10}} onPress={() => {
        }} >
          <Image
            source={{uri:item.url}}
            resizeMode='cover'
            style={{flex:1,width:ITEM_WIDTH,height:ITEM_HEIGHT,borderRadius:6,borderWidth:1,borderColor:Constants.colorCode.liteGray }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { images }= this.props;
    return (
      <View style={{}}>
        <ScrollView

          scrollEventThrottle={200}
          directionalLockEnabled={true}
        >
          <Carousel
            ref={(c) => (this.carousel = c)}
            data={images}
            renderItem={this._renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            autoplay={false}
            loop={true}
            elevation={5}
            firstItem={0}
            autoplayInterval={2000}
            onSnapToItem={(index) => this.setState({ index })}
            containerCustomStyle={styles.carouselContainer}
            useScrollView={true}
            layout={'default'}
            enableMomentum={true}
            decelerationRate={0.9}
          />

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 10,
    marginBottom: 10,
    elevation:5,
    overflow:'visible'
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',


  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
